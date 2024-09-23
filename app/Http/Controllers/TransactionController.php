<?php
namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // Store a new transaction
    public function store(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'client_id' => 'required|integer',
            'amount' => 'required|numeric',
            'client_name' => 'required|string|max:255',
            'performer_name' => 'nullable|string|max:255',
            'transaction_status' => 'required|string|max:255',
        ]);

        // Create a new transaction record in the database
        $transaction = Transaction::create([
            'client_id' => $validatedData['client_id'],
            'amount' => $validatedData['amount'],
            'client_name' => $validatedData['client_name'],
            'performer_name' => $validatedData['performer_name'] ?? null,
            'transaction_status' => $validatedData['transaction_status'],
            'transaction_date' => now(),
        ]);

        // Return a success response
        return response()->json($transaction, 201);
    }


    // Get all transactions
    public function index()
    {
        $transactions = Transaction::all();
        return response()->json($transactions);
    }

    // Show a specific transaction
    public function show($id)
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }
        return response()->json($transaction);
    }
}
