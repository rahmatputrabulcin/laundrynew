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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama produk
            $table->decimal('price', 10, 2); // Harga produk
            $table->text('description')->nullable(); // Deskripsi produk
            $table->unsignedBigInteger('created_by')->nullable(); // ID pengguna yang membuat
            $table->unsignedBigInteger('updated_by')->nullable(); // ID pengguna yang memperbarui
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
