<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WageController;
use App\Http\Controllers\CustomerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route untuk authenticated users
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Resource routes (semua role authenticated bisa akses)
    Route::resource('jobs', JobController::class);
    Route::resource('products', ProductController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('transactions', TransactionController::class);
    Route::resource('expenses', ExpenseController::class);
    Route::resource('wages', WageController::class);
    
    // Custom routes untuk transactions
    Route::put('transactions/{transaction}/status', [TransactionController::class, 'updateStatus'])->name('transactions.updateStatus');
    Route::put('transactions/{transaction}/payment', [TransactionController::class, 'updatePayment'])->name('transactions.updatePayment');
    Route::get('transactions/{transaction}/print', [TransactionController::class, 'print'])->name('transactions.print');
    Route::get('transactions/{transaction}/print-pdf', [TransactionController::class, 'printPdf'])->name('transactions.printPdf');
    Route::get('/transactions/export', [TransactionController::class, 'export'])->name('transactions.export');
    Route::get('/transactions/export-pdf', [TransactionController::class, 'exportPdf'])->name('transactions.exportPdf');
    
    // Custom routes untuk jobs
    Route::get('/jobs/{job}/report', [JobController::class, 'singleReport'])->name('jobs.singleReport');
    Route::get('/jobs/report', [JobController::class, 'report'])->name('jobs.report');
    
    // Report routes
    Route::get('reports/transactions', [\App\Http\Controllers\ReportController::class, 'transactions'])->name('reports.transactions');
});

// Route khusus admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class);
});

require __DIR__.'/auth.php';
