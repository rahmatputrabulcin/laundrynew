<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index()
    {
        return Inertia::render('Jobs/Index', [
            'jobs' => []
        ]);
    }

    public function create()
    {
        return Inertia::render('Jobs/Create');
    }

    public function store(Request $request)
    {
        return redirect()->route('jobs.index');
    }

    public function show($id)
    {
        return Inertia::render('Jobs/Show');
    }

    public function edit($id)
    {
        return Inertia::render('Jobs/Edit');
    }

    public function update(Request $request, $id)
    {
        return redirect()->route('jobs.index');
    }

    public function destroy($id)
    {
        return redirect()->route('jobs.index');
    }

    // Method report yang missing
    public function report(Request $request)
    {
        return Inertia::render('Jobs/Report', [
            'jobs' => [],
            'filters' => $request->all(),
            'stats' => [
                'total_jobs' => 0,
                'completed_jobs' => 0,
                'pending_jobs' => 0,
                'total_revenue' => 0
            ]
        ]);
    }
}
