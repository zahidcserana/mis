<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Investor;
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
        $query = Account::query();
        $accounts = $query->paginate(10)
            ->withQueryString()
            ->through(fn ($account) => [
                'id' => $account->id,
                'name' => $account->name,
                'amount' => $account->amount,
                'is_active' => $account->is_active,
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        //
    }
}
