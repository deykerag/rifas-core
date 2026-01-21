<?php

namespace Tests\Feature;

use App\Models\PaymentMethod;
use App\Models\Raffle;
use App\Models\Shopping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ShoppingReferenceUniquenessTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_register_duplicate_reference()
    {
        Storage::fake('public');

        $raffle = Raffle::create([
            'description' => 'Test Raffle',
            'price_usd' => 10,
            'price_bs' => 1000,
            'tickets_quantity' => 100,
            'status' => 'active',
        ]);

        $paymentMethod = PaymentMethod::create([
            'name' => 'Test Payment',
            'description' => 'Test Description',
            'status' => 'active',
        ]);

        $reference = 'REF123456';

        // First purchase
        $response = $this->postJson('/purchase', [
            'raffle_id' => $raffle->id,
            'payment_method_id' => $paymentMethod->id,
            'name' => 'User One',
            'dni' => '123456',
            'phone' => '123456789',
            'email' => 'user1@example.com',
            'quantity' => 1,
            'amount' => 10,
            'reference' => $reference,
            'voucher' => UploadedFile::fake()->image('voucher.jpg'),
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('shoppings', ['reference' => $reference]);

        // Second purchase with same reference should fail
        $response = $this->postJson('/purchase', [
            'raffle_id' => $raffle->id,
            'payment_method_id' => $paymentMethod->id,
            'name' => 'User Two',
            'dni' => '654321',
            'phone' => '987654321',
            'email' => 'user2@example.com',
            'quantity' => 1,
            'amount' => 10,
            'reference' => $reference,
            'voucher' => UploadedFile::fake()->image('voucher2.jpg'),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['reference']);
    }
}
