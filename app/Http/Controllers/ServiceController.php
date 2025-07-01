<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return inertia('Services/Index', ['services' => $services]);
    }

    public function create()
    {
        return inertia('Services/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'price_type' => 'required|in:per_kg,per_item,fixed',
            'is_express' => 'boolean',
            'express_multiplier' => 'nullable|numeric|min:1',
            'description' => 'nullable|string',
        ]);

        Service::create($request->all());
        return redirect()->route('services.index')->with('success', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        return inertia('Services/Edit', ['service' => $service]);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'price_type' => 'required|in:per_kg,per_item,fixed',
            'is_express' => 'boolean',
            'express_multiplier' => 'nullable|numeric|min:1',
            'description' => 'nullable|string',
        ]);

        $service->update($request->all());
        return redirect()->route('services.index')->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        // Check if service is used in transactions
        if ($service->transactionDetails()->count() > 0) {
            return back()->with('error', 'Cannot delete service that is used in transactions.');
        }

        $service->delete();
        return redirect()->route('services.index')->with('success', 'Service deleted successfully.');
    }
}
