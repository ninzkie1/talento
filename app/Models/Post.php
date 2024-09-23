<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $table = 'posts';
    protected $fillable = [
        'client_name',
        'event_name',
        'start_time',
        'end_time',
        'description',
        'talents',
    ];
    protected $casts = [
        'talents' => 'array', // Ensure that the talents field is cast to an array
    ];
    
}
