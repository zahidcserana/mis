<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\Investment;
use App\Models\Payment;
use App\Models\Investor;
use App\Models\Account;

class HomeController extends Controller
{
    public function dashboard(): Response
    {
        $monthlyTotals = Payment::query()
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_investors' => Investor::count(),
                'total_accounts' => Account::count(),
                'total_amount' => Payment::sum('amount'),
            ],
            'monthly_totals' => $monthlyTotals,
        ]);
    }
}
