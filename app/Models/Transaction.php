<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'amount',
        'client_name',
        'performer_name',
        'transaction_status',
        'transaction_date',
    ];
    
    // Define relationship to User (Client)
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
