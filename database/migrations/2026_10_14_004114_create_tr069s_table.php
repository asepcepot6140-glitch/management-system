<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr069s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->string('host');
            $table->unsignedSmallInteger('port')->default(7557);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr069s');
    }
};