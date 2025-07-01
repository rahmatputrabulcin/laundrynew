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
        Schema::table('jobs', function (Blueprint $table) {
            $table->unsignedBigInteger('detail_id')->nullable()->after('transaction_id');
            $table->foreign('detail_id')->references('id')->on('transaction_details')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('jobs', function (Blueprint $table) {
            $table->dropForeign(['detail_id']);
            $table->dropColumn('detail_id');
        });
    }
};
