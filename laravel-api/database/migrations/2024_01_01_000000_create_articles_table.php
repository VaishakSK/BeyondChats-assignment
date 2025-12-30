<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('author')->default('Unknown');
            $table->date('published_date')->nullable();
            $table->string('source_url')->nullable();
            $table->string('image_url')->nullable();
            $table->text('excerpt')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_scraped')->default(false);
            $table->unsignedBigInteger('original_article_id')->nullable();
            $table->integer('version')->default(1);
            $table->timestamps();

            $table->foreign('original_article_id')->references('id')->on('articles')->onDelete('cascade');
            $table->index('published_date');
            $table->index('source_url');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

