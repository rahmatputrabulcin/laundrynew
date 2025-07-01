<?php
namespace App\Http\Controllers;

use App\Models\Wage;
use Illuminate\Http\Request;

class WageController extends Controller
{
    public function index()
    {
        $wages = Wage::all();
        return inertia('Wages/Index', compact('wages'));
    }

    public function create()
    {
        return inertia('Wages/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'jenis' => 'required|unique:wages,jenis',
            'tarif_per_kilo' => 'required|integer|min:1',
        ]);
        Wage::create($request->all());
        return redirect()->route('wages.index')->with('success', 'Upah berhasil ditambah!');
    }

    public function edit(Wage $wage)
    {
        return inertia('Wages/Edit', compact('wage'));
    }

    public function update(Request $request, Wage $wage)
    {
        $request->validate([
            'jenis' => 'required|unique:wages,jenis,' . $wage->id,
            'tarif_per_kilo' => 'required|integer|min:1',
        ]);
        $wage->update($request->all());
        return redirect()->route('wages.index')->with('success', 'Upah berhasil diupdate!');
    }

    public function destroy(Wage $wage)
    {
        $wage->delete();
        return redirect()->route('wages.index')->with('success', 'Upah berhasil dihapus!');
    }
}
