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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('jenis'); // setrika/cuci/dll
        $table->float('jumlah_kilo');
        $table->integer('tarif_per_kilo')->default(2000); // bisa diubah sesuai kebutuhan
        $table->date('tanggal');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
