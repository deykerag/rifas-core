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
        Schema::create('shoppings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('raffle_id')->nullable()->constrained('raffles')->onDelete('set null');
            $table->foreignId('payment_method_id')->nullable()->constrained('payment_methods')->onDelete('set null');
            $table->string('dni', 50)->nullable();
            $table->string('name', 150);
            $table->string('phone', 50);
            $table->string('email', 150);
            $table->unsignedInteger('quantity')->comment('Cantidad de tickets comprados en esta transacción');
            $table->decimal('amount', 10, 2);
            $table->string('reference', 255)->nullable()->comment('Referencia de la transacción');
            $table->json('assigned_numbers')->nullable()->comment('Lista de números de tickets asignados o rango de números');
            $table->string('voucher', 255)->nullable()->comment('URL o ruta del comprobante de pago');
            $table->enum('status', ['pending', 'paid', 'rejected'])->default('pending')->comment('Estado de la compra');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shoppings');
    }
};
