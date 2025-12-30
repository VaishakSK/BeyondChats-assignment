<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'author',
        'published_date',
        'source_url',
        'image_url',
        'excerpt',
        'tags',
        'is_scraped',
        'original_article_id',
        'version',
    ];

    protected $casts = [
        'published_date' => 'date',
        'tags' => 'array',
        'is_scraped' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationship: Get original article
    public function originalArticle()
    {
        return $this->belongsTo(Article::class, 'original_article_id');
    }

    // Relationship: Get all updates/versions
    public function updates()
    {
        return $this->hasMany(Article::class, 'original_article_id');
    }
}

