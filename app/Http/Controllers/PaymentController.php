<?php

namespace App\Http\Controllers;

use App\Models\Investor;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Payment::query()->with('investor');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('investor', function ($q2) use ($search) {
                $q2->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by verification
        if ($request->has('is_adjusted') && $request->is_adjusted !== '') {
            $query->where('is_adjusted', $request->is_adjusted === 'is_adjusted');
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        $allowedSorts = ['investor', 'created_at', 'is_adjusted'];

        if (in_array($sortField, $allowedSorts)) {
            if ($sortField === 'investor') {
                $query->join('investors', 'payments.investor_id', '=', 'investors.id')
                    ->orderBy('investors.name', $sortDirection)
                    ->select('payments.*'); // ensure you're selecting from the main table
            } else {
                $query->orderBy($sortField, $sortDirection);
            }
        }

        // Paginate & Transform
        $payments = $query->paginate(10)
            ->withQueryString()
            ->through(fn($payment) => [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'is_active' => $payment->is_adjusted,
                'investor' => [
                    'id' => $payment->investor->id,
                    'name' => $payment->investor->name,
                ],
                'created_at' => $payment->created_at->format('M d, Y'),
            ]);

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'filters' => [
                'search' => $request->get('search', ''),
                'is_adjusted' => $request->get('is_adjusted', ''),
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
        return Inertia::render('payments/create', [
            'investors' => Investor::get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'investor_id' => 'required|exists:investors,id',
            'remarks' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();

        Payment::create($validated);

        return redirect()->route('payments.index')
            ->with('success', 'Payment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load('investor.activeAccounts');

        return Inertia::render('payments/show', [
            'payment' => $payment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        return Inertia::render('payments/edit', [
            'payment' => $payment,
            'investors' => Investor::get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'investor_id' => 'required|exists:investors,id',
            'remarks' => 'nullable|string',
        ]);

        $payment->update($validated);

        return redirect()->route('payments.show', $payment)
            ->with('success', 'Payment updated successfully.');
    }

    public function adjust(Payment $payment): RedirectResponse
    {
        // $this->authorize('update', $investor);

        $payment->update(['is_adjusted' => !$payment->is_adjusted]);

        return back()->with('success', `Data successfully updated.`);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
