<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvestmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Investment $investment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Investment $investment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Investment $investment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Investment $investment)
    {
        //
    }

    public function storeBulk(Request $request)
    {
        $validated = $request->validate([
            'investments' => 'required|array|min:1',
            'investments.*.account_id' => 'required|exists:accounts,id',
            'investments.*.for_month' => 'required|date_format:Y-m',
            'investments.*.amount' => 'required|numeric|min:0',
            'investments.*.type' => 'required|in:regular,eid,others',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['investments'] as $data) {
                Investment::create($data);
            }
        });

        return redirect()->back()->with('success', 'Investments added successfully!');
    }
}
