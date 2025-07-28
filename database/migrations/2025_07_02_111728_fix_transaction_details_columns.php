<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cek kolom yang ada
        $columns = Schema::getColumnListing('transaction_details');
        
        Schema::table('transaction_details', function (Blueprint $table) use ($columns) {
            // Tambah product_id jika belum ada
            if (!in_array('product_id', $columns)) {
                $table->unsignedBigInteger('product_id')->nullable()->after('service_id');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            }
            
            // Tambah is_express jika belum ada
            if (!in_array('is_express', $columns)) {
                $table->boolean('is_express')->default(false)->after('subtotal');
            }
            
            // Tambah express_fee jika belum ada
            if (!in_array('express_fee', $columns)) {
                $table->decimal('express_fee', 15, 2)->default(0)->after('is_express');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn(['product_id', 'is_express', 'express_fee']);
        });
    }
};
