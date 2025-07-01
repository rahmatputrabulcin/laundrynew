<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::all();
        return inertia('Customers/Index', ['customers' => $customers]);
    }

    public function create()
    {
        return inertia('Customers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
        ]);

        Customer::create($request->all());
        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        $transactions = $customer->transactions()->orderBy('created_at', 'desc')->get();

        return inertia('Customers/Show', [
            'customer' => $customer,
            'transactions' => $transactions,
        ]);
    }

    public function edit(Customer $customer)
    {
        return inertia('Customers/Edit', ['customer' => $customer]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
        ]);

        $customer->update($request->all());
        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        // Check if customer has transactions before deleting
        if ($customer->transactions()->count() > 0) {
            return back()->with('error', 'Cannot delete customer with transactions.');
        }

        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }
}
