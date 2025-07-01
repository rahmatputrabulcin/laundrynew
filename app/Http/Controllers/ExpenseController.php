<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::latest()->get();
        return inertia('Expenses/Index', ['expenses' => $expenses]);
    }

    public function create()
    {
        return inertia('Expenses/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|in:supplies,utility,salary,rent,maintenance,other',
            'expense_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        // Pastikan created_by dan updated_by ikut diisi
        Expense::create([
            'title' => $request->title,
            'amount' => $request->amount,
            'category' => $request->category,
            'expense_date' => $request->expense_date, // format dari input date sudah benar
            'description' => $request->description,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('expenses.index')->with('success', 'Expense added.');
    }

    public function edit(Expense $expense)
    {
        return inertia('Expenses/Edit', ['expense' => $expense]);
    }

    public function update(Request $request, Expense $expense)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|in:supplies,utility,salary,rent,maintenance,other',
            'expense_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $expense->update([
            'title' => $request->title,
            'amount' => $request->amount,
            'category' => $request->category,
            'expense_date' => $request->expense_date,
            'description' => $request->description,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('expenses.index')->with('success', 'Expense updated.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return redirect()->route('expenses.index')->with('success', 'Expense deleted.');
    }
}
