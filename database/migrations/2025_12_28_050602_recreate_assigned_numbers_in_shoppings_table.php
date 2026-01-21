<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shoppings', function (Blueprint $table) {
            // Eliminamos la columna BLOB actual
            $table->dropColumn('assigned_numbers');
        });

        Schema::table('shoppings', function (Blueprint $table) {
            // Creamos la columna nueva como JSON (o TEXT si tu DB es antigua)
            // Se coloca después de 'quantity' para mantener el orden de tu imagen
            $table->json('assigned_numbers')->nullable()->after('quantity');
        });
    }

    public function down(): void
    {
        Schema::table('shoppings', function (Blueprint $table) {
            $table->dropColumn('assigned_numbers');
        });
        
        Schema::table('shoppings', function (Blueprint $table) {
            $table->binary('assigned_numbers')->nullable()->after('quantity');
        });
    }
};
