<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WageController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth', 'role:admin,setrika')->group(function () {
    Route::resource('users', UserController::class);
Route::get('/jobs/{job}/report', [JobController::class, 'singleReport'])->name('jobs.singleReport');
    Route::get('/jobs/report', [JobController::class, 'report'])->name('jobs.report');
    Route::resource('jobs', JobController::class);


    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');


    Route::resource('products', ProductController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('services', ServiceController::class);


    // Tambahkan ini di dalam middleware auth group
    Route::get('/transactions/export', [TransactionController::class, 'export'])->name('transactions.export');

    Route::resource('transactions', TransactionController::class);
    Route::put('transactions/{transaction}/status', [TransactionController::class, 'updateStatus'])->name('transactions.update-status');
    Route::put('transactions/{transaction}/payment', [TransactionController::class, 'updatePayment'])->name('transactions.update-payment');
    Route::get('transactions/{transaction}/print', [TransactionController::class, 'print'])->name('transactions.print');
    Route::get('reports/transactions', [\App\Http\Controllers\ReportController::class, 'transactions'])->name('reports.transactions');
    Route::patch('transactions/{transaction}/status', [TransactionController::class, 'updateStatus'])->name('transactions.updateStatus');
    // Ubah route dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

    Route::resource('expenses', ExpenseController::class);


    Route::resource('wages', WageController::class)->middleware(['auth', 'role:admin']);
});
