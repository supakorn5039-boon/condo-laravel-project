<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('owner_id')->nullable()->comment('refers to user_id in users table');
            $table->text('address');
            $table->string('name');
            $table->text('description');
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->decimal('price');
            $table->decimal('area');

            $table->enum('type', ['rent', 'sale']);
            $table->boolean('is_available')->default(true);

            $table->timestamps();
            $table->softDeletes();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
