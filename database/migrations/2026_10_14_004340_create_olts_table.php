
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('olts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->string('host');
            $table->string('model');
            $table->string('vendor');
            $table->string('protocol');
            $table->unsignedSmallInteger('port')->nullable();
            $table->string('username')->nullable();
            $table->text('password')->nullable();
            $table->text('snmp_ro')->nullable();
            $table->text('snmp_rw')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('olts');
    }
};
