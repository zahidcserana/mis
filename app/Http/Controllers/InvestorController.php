<?php

namespace App\Http\Controllers;

use App\Models\Investor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InvestorController extends Controller
{
    /**
     * Display a listing of the investors.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Investor::class);

        $investors = Investor::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('uid', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Investors/Index', [
            'investors' => $investors,
            'filters' => $request->only(['search', 'status']),
            'statuses' => Investor::getStatuses(),
        ]);
    }

    /**
     * Show the form for creating a new investor.
     */
    public function create(): Response
    {
        $this->authorize('create', Investor::class);

        return Inertia::render('Investors/Create', [
            'statuses' => Investor::getStatuses(),
        ]);
    }

    /**
     * Store a newly created investor in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Investor::class);

        $validated = $request->validate([
            'uid' => ['required', 'string', 'max:255', 'unique:investors'],
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:investors'],
            'permanent_address' => ['required', 'string'],
            'current_address' => ['required', 'string'],
            'personal_info' => ['nullable', 'array'],
            'mobile' => ['required', 'string', 'max:20'],
            'emergency_mobile' => ['nullable', 'string', 'max:20'],
            'status' => ['required', Rule::in(Investor::getStatuses())],
        ]);

        $validated['user_id'] = Auth::id();

        $investor = Investor::create($validated);

        return redirect()->route('investors.show', $investor)
            ->with('success', 'Investor created successfully.');
    }

    /**
     * Display the specified investor.
     */
    public function show(Investor $investor): Response
    {
        $this->authorize('view', $investor);

        $investor->load('user');

        return Inertia::render('Investors/Show', [
            'investor' => $investor,
        ]);
    }

    /**
     * Show the form for editing the specified investor.
     */
    public function edit(Investor $investor): Response
    {
        $this->authorize('update', $investor);

        return Inertia::render('Investors/Edit', [
            'investor' => $investor,
            'statuses' => Investor::getStatuses(),
        ]);
    }

    /**
     * Update the specified investor in storage.
     */
    public function update(Request $request, Investor $investor): RedirectResponse
    {
        $this->authorize('update', $investor);

        $validated = $request->validate([
            'uid' => ['required', 'string', 'max:255', Rule::unique('investors')->ignore($investor->id)],
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('investors')->ignore($investor->id)],
            'permanent_address' => ['required', 'string'],
            'current_address' => ['required', 'string'],
            'personal_info' => ['nullable', 'array'],
            'mobile' => ['required', 'string', 'max:20'],
            'emergency_mobile' => ['nullable', 'string', 'max:20'],
            'status' => ['required', Rule::in(Investor::getStatuses())],
        ]);

        $investor->update($validated);

        return redirect()->route('investors.show', $investor)
            ->with('success', 'Investor updated successfully.');
    }

    /**
     * Remove the specified investor from storage.
     */
    public function destroy(Investor $investor): RedirectResponse
    {
        $this->authorize('delete', $investor);

        $investor->delete();

        return redirect()->route('investors.index')
            ->with('success', 'Investor deleted successfully.');
    }

    /**
     * Activate an investor.
     */
    public function activate(Investor $investor): RedirectResponse
    {
        $this->authorize('update', $investor);

        $investor->update(['status' => Investor::STATUS_ACTIVE]);

        return back()->with('success', 'Investor activated successfully.');
    }

    /**
     * Set investor status to pending.
     */
    public function setPending(Investor $investor): RedirectResponse
    {
        $this->authorize('update', $investor);

        $investor->update(['status' => Investor::STATUS_PENDING]);

        return back()->with('success', 'Investor status set to pending.');
    }
}