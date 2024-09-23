<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->unsignedBigInteger('client_id'); // Foreign Key: the client/user who initiated the transaction
            $table->integer('amount'); // Transaction amount
            $table->string('client_name'); // Name of the client
            $table->string('performer_name')->nullable(); // Name of the performer involved (nullable if needed)
            $table->string('transaction_status'); // Transaction status (e.g., 'completed', 'pending')
            $table->timestamp('transaction_date')->useCurrent(); // Transaction date with default current timestamp
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('client_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('transactions');
    }
};
