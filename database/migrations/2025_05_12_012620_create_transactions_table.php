<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('customer_id')->constrained();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->enum('status', ['pending', 'processing', 'completed', 'delivered'])->default('pending');
            $table->dateTime('estimated_completion')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
