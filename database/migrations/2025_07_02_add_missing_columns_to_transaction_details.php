<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            // Cek dan tambah kolom jika belum ada
            if (!Schema::hasColumn('transaction_details', 'product_id')) {
                $table->unsignedBigInteger('product_id')->nullable()->after('service_id');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            }
            
            if (!Schema::hasColumn('transaction_details', 'express_fee')) {
                $table->decimal('express_fee', 15, 2)->default(0)->after('is_express');
            }
            
            if (!Schema::hasColumn('transaction_details', 'is_express')) {
                $table->boolean('is_express')->default(false)->after('subtotal');
            }
        });
    }

    public function down()
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            if (Schema::hasColumn('transaction_details', 'product_id')) {
                $table->dropForeign(['product_id']);
                $table->dropColumn('product_id');
            }
            
            if (Schema::hasColumn('transaction_details', 'express_fee')) {
                $table->dropColumn('express_fee');
            }
            
            if (Schema::hasColumn('transaction_details', 'is_express')) {
                $table->dropColumn('is_express');
            }
        });
    }
};
