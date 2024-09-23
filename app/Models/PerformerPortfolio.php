<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformerPortfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'performer_name', 'event_name', 'theme_name', 'talent_name', 'location', 'description', 'rate', 'background_image'
    ];
}
