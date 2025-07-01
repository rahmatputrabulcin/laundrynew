<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wage;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index()
    {
        $jobs = Job::with('user')->latest()->paginate(20);
        return inertia('Jobs/Index', compact('jobs'));
    }

    public function create()
    {
        $transactions = \App\Models\Transaction::with(['customer', 'details.service'])->get();
        $users = User::whereIn('role', ['setrika', 'cuci', 'operator'])->get();
        $wages = Wage::all();
        $currentUser = auth()->user();
        // Ambil semua detail_id yang sudah dipakai di jobs
        $usedDetailIds = \App\Models\Job::pluck('detail_id')->toArray();

        return inertia('Jobs/Create', compact('transactions', 'users', 'wages', 'currentUser', 'usedDetailIds'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'transaction_id' => 'required|exists:transactions,id',
            'detail_id' => 'required|exists:transaction_details,id',
            'jenis' => 'required|in:setrika,cuci,operator',
            'jumlah_kilo' => 'required|numeric|min:0.1',
            'tarif_per_kilo' => 'required|integer|min:1',
            'tanggal' => 'required|date',
        ]);

        Job::create([
            'user_id'         => $request->user_id,
            'transaction_id'  => $request->transaction_id,
            'detail_id'       => $request->detail_id,
            'jenis'           => $request->jenis,
            'jumlah_kilo'     => $request->jumlah_kilo,
            'tarif_per_kilo'  => $request->tarif_per_kilo,
            'tanggal'         => $request->tanggal,
        ]);

        return redirect()->route('jobs.index')->with('success', 'Pekerjaan berhasil dicatat!');
    }

    public function laporanGaji(Request $request)
    {
        $userId = $request->user_id;
        $tanggalAwal = $request->tanggal_awal;
        $tanggalAkhir = $request->tanggal_akhir;

        $jobs = Job::where('user_id', $userId)
            ->whereBetween('tanggal', [$tanggalAwal, $tanggalAkhir])
            ->get();

        $totalKilo = $jobs->sum('jumlah_kilo');
        $totalGaji = $jobs->sum(function ($job) {
            return $job->jumlah_kilo * $job->tarif_per_kilo;
        });

        return inertia('Jobs/Laporan', compact('jobs', 'totalKilo', 'totalGaji'));
    }

    public function show(Job $job)
    {
        $job->load(['user', 'transaction', 'detail.service']);
        return inertia('Jobs/Show', compact('job'));
    }

    public function edit(Job $job)
    {
        $users = User::whereIn('role', ['setrika', 'cuci', 'operator'])->get();
        $wages = Wage::all();
        return inertia('Jobs/Edit', compact('job', 'users', 'wages'));
    }

    public function update(Request $request, Job $job)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'jenis' => 'required|in:setrika,cuci,operator',
            'jumlah_kilo' => 'required|numeric|min:0.1',
            'tarif_per_kilo' => 'required|integer|min:1',
            'tanggal' => 'required|date',
        ]);
        $job->update($request->all());
        return redirect()->route('jobs.index')->with('success', 'Pekerjaan berhasil diupdate!');
    }

    public function report(Request $request)
    {
        $users = \App\Models\User::whereIn('role', ['setrika', 'cuci', 'operator'])->get();
        $services = \App\Models\Service::all();

        $query = \App\Models\Job::with(['user', 'detail.service']);

        if ($request->user_id) $query->where('user_id', $request->user_id);
        if ($request->tanggal) $query->whereDate('tanggal', $request->tanggal);
        if ($request->bulan) $query->whereMonth('tanggal', $request->bulan);
        if ($request->tahun) $query->whereYear('tanggal', $request->tahun);
        if ($request->service_id) {
            $query->whereHas('detail', function ($q) use ($request) {
                $q->where('service_id', $request->service_id);
            });
        }

        $jobs = $query->orderBy('tanggal', 'desc')->get();

        $total_upah = $jobs->sum(function ($job) {
            return $job->jumlah_kilo * $job->tarif_per_kilo;
        });

        $total_kiloan = $jobs->sum('jumlah_kilo');

        $rekap_per_pegawai = $jobs->groupBy('user_id')->map(function ($items) {
            return [
                'nama' => $items->first()->user->name ?? '-',
                'total_kiloan' => $items->sum('jumlah_kilo'),
                'total_upah' => $items->sum(function ($job) {
                    return $job->jumlah_kilo * $job->tarif_per_kilo;
                }),
            ];
        })->values();

        $rekap_per_layanan = $jobs->groupBy(function ($job) {
            return $job->detail->service->name ?? '-';
        })->map(function ($items, $layanan) {
            return [
                'layanan' => $layanan,
                'total_kiloan' => $items->sum('jumlah_kilo'),
                'total_upah' => $items->sum(function ($job) {
                    return $job->jumlah_kilo * $job->tarif_per_kilo;
                }),
            ];
        })->values();
        return inertia('Jobs/Report', [
            'jobs' => $jobs,
            'users' => $users,
            'services' => $services,
            'filters' => $request->only(['user_id', 'tanggal', 'bulan', 'tahun', 'service_id']),
            'total_upah' => $total_upah,
            'total_kiloan' => $total_kiloan,
            'rekap_per_pegawai' => $rekap_per_pegawai,
            'rekap_per_layanan' => $rekap_per_layanan,
        ]);
    }

    public function singleReport(Job $job)
    {
        $job->load(['user', 'detail.service']);
        $total_upah = $job->jumlah_kilo * $job->tarif_per_kilo;

        return inertia('Jobs/SingleReport', [
            'job' => $job,
            'total_upah' => $total_upah,
        ]);
    }
}
