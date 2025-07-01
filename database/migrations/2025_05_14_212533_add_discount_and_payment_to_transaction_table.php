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
       Schema::table('transactions', function (Blueprint $table) {
            $table->enum('discount_type', ['amount', 'percent'])->nullable()->after('total_amount');
            $table->decimal('discount_value', 10, 2)->default(0)->after('discount_type');
            $table->decimal('final_total', 15, 2)->default(0)->after('discount_value');
            $table->enum('payment_status', ['lunas', 'belum lunas'])->default('belum lunas')->after('final_total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['discount_type', 'discount_value', 'final_total', 'payment_status']);
        });
    }
};
