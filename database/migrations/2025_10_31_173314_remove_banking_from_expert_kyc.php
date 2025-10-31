<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration removes all banking-related fields from the expert_kyc table
     * as payment processing will be handled separately in the future.
     */
    public function up(): void
    {
        Schema::table('expert_kyc', function (Blueprint $table) {
            // Remove banking information columns
            $table->dropColumn([
                'bank_name',
                'account_holder_name',
                'account_number_encrypted',
                'routing_number',
                'tax_id_encrypted',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expert_kyc', function (Blueprint $table) {
            // Restore banking information columns
            $table->string('bank_name', 255)->nullable();
            $table->string('account_holder_name', 255)->nullable();
            $table->text('account_number_encrypted')->nullable();
            $table->string('routing_number', 20)->nullable();
            $table->text('tax_id_encrypted')->nullable();
        });
    }
};
