<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Investor;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Account::query()->with('investor')
                ->withSum('investments', 'amount');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('accounts.name', 'like', "%{$search}%")
                    ->orWhereHas('investor', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by verification
        if ($request->has('verified') && $request->verified !== '') {
            $query->where('is_active', $request->verified === 'verified');
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        $allowedSorts = ['name', 'investor', 'created_at', 'is_active'];

        if (in_array($sortField, $allowedSorts)) {
            if ($sortField === 'investor') {
                $query->join('investors', 'accounts.investor_id', '=', 'investors.id')
                    ->orderBy('investors.name', $sortDirection)
                    ->select('accounts.*'); // ensure you're selecting from the main table
            } else {
                $query->orderBy($sortField, $sortDirection);
            }
        }

        // Paginate & Transform
        $accounts = $query->paginate(10)
            ->withQueryString()
            ->through(fn($account) => [
                'id' => $account->id,
                'name' => $account->name,
                'amount' => $account->amount,
                'is_active' => $account->is_active,
                'total_amount' => $account->investments_sum_amount ?? 0.00,
                'investor' => [
                    'id' => $account->investor->id,
                    'name' => $account->investor->name,
                ],
                'created_at' => $account->created_at->format('M d, Y'),
            ]);

        return Inertia::render('accounts/index', [
            'accounts' => $accounts,
            'filters' => [
                'search' => $request->get('search', ''),
                'verified' => $request->get('verified', ''),
                'sort' => $request->get('sort', 'created_at'),
                'direction' => $request->get('direction', 'desc'),
            ],
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('accounts/create', [
            'investors' => Investor::get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'investor_id' => 'required|exists:investors,id',
        ]);

        Account::create($validated);

        return redirect()->route('accounts.index')
            ->with('success', 'Account created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        $account->load('investor');

        return Inertia::render('accounts/show', [
            'account' => $account,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        return Inertia::render('accounts/edit', [
            'account' => $account,
            'investors' => Investor::get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'investor_id' => 'required|exists:investors,id',
        ]);

        $account->update($validated);

        return redirect()->route('accounts.show', $account)
            ->with('success', 'Account updated successfully.');
    }

     /**
     * Activate an investor.
     */
    public function activate(Account $account): RedirectResponse
    {
        // $this->authorize('update', $investor);

        $account->update(['is_active' => !$account->is_active]);

        $activated = $account->is_active ? 'activated': 'inactivated';

        return back()->with('success', `Account activated successfully.`);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account): RedirectResponse
    {
        // $this->authorize('delete', $account);

        $account->delete();

        return redirect()->route('accounts.index')
            ->with('success', 'Account deleted successfully.');
    }
}
