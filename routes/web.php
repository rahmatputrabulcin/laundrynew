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
use App\Http\Controllers\ReportController;
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

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Customer routes
    Route::resource('customers', CustomerController::class);
    
    // Service routes  
    Route::resource('services', ServiceController::class);
    
    // Product routes
    Route::resource('products', ProductController::class);
    
    // Transaction routes
    Route::resource('transactions', TransactionController::class);
    
    // Additional transaction routes
    Route::post('transactions/{transaction}/update-status', [TransactionController::class, 'updateStatus'])->name('transactions.update-status');
    Route::post('transactions/{transaction}/update-payment', [TransactionController::class, 'updatePayment'])->name('transactions.update-payment');
    Route::get('transactions/{transaction}/print', [TransactionController::class, 'print'])->name('transactions.print');
    
    // Export routes untuk transactions
    Route::get('transactions/export/excel', [TransactionController::class, 'export'])->name('transactions.export');
    Route::get('transactions/export/pdf', [TransactionController::class, 'exportPdf'])->name('transactions.exportPdf');
    
    // Expense routes
    Route::resource('expenses', ExpenseController::class);
    Route::get('expenses/report', [ExpenseController::class, 'report'])->name('expenses.report');
    
    // Job routes
    Route::resource('jobs', JobController::class);
    Route::get('jobs/report', [JobController::class, 'report'])->name('jobs.report');
    
    // Wage routes
    Route::resource('wages', WageController::class);
    Route::get('wages/report', [WageController::class, 'report'])->name('wages.report');
    
    // Reports routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions');
        Route::get('/transactions/export', [TransactionController::class, 'export'])->name('transactions.export');
        Route::get('/transactions/export-pdf', [TransactionController::class, 'exportPdf'])->name('transactions.exportPdf');
        Route::get('/expenses', [ExpenseController::class, 'report'])->name('expenses');
        Route::get('/jobs', [JobController::class, 'report'])->name('jobs');
        Route::get('/wages', [WageController::class, 'report'])->name('wages');
        Route::get('/newreport', [ReportController::class, 'newreport'])->name('newreport');
    });
});

// Route khusus admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class);
});

require __DIR__.'/auth.php';
