<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Create original article
        $original = Article::create([
            'title' => 'Getting Started with Laravel',
            'content' => 'Laravel is a powerful PHP framework that provides an elegant syntax and a robust set of tools for building modern web applications. It follows the MVC (Model-View-Controller) architectural pattern and includes features like routing, authentication, caching, and more.',
            'author' => 'John Doe',
            'published_date' => now(),
            'excerpt' => 'Learn the basics of Laravel framework and how to get started with building web applications.',
            'version' => 1,
            'tags' => ['Laravel', 'PHP', 'Web Development'],
        ]);

        // Create updated version
        Article::create([
            'title' => 'Getting Started with Laravel (Updated)',
            'content' => 'Laravel is a powerful PHP framework that provides an elegant syntax and a robust set of tools for building modern web applications. It follows the MVC (Model-View-Controller) architectural pattern and includes features like routing, authentication, caching, queues, and more. This updated version includes the latest features from Laravel 10.',
            'author' => 'John Doe',
            'published_date' => now(),
            'excerpt' => 'Learn the basics of Laravel framework and how to get started with building web applications - Updated with latest features.',
            'original_article_id' => $original->id,
            'version' => 2,
            'tags' => ['Laravel', 'PHP', 'Web Development', 'Laravel 10'],
        ]);

        // Create more sample articles
        Article::create([
            'title' => 'Understanding React Hooks',
            'content' => 'React Hooks allow you to use state and other React features without writing a class. They were introduced in React 16.8 and have become the standard way to write React components. Hooks like useState, useEffect, and useContext make it easier to manage component state and side effects.',
            'author' => 'Jane Smith',
            'published_date' => now()->subDays(5),
            'excerpt' => 'A comprehensive guide to React Hooks and how to use them effectively in your React applications.',
            'version' => 1,
            'tags' => ['React', 'JavaScript', 'Frontend'],
        ]);

        Article::create([
            'title' => 'Building RESTful APIs with Node.js',
            'content' => 'Node.js is a powerful runtime for building server-side applications. When combined with Express.js, it becomes an excellent tool for creating RESTful APIs. This guide covers the fundamentals of API design, routing, middleware, and database integration.',
            'author' => 'Mike Johnson',
            'published_date' => now()->subDays(10),
            'excerpt' => 'Learn how to build robust RESTful APIs using Node.js and Express.js.',
            'version' => 1,
            'tags' => ['Node.js', 'Express', 'API', 'Backend'],
        ]);
    }
}

