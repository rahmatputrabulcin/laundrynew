<?php
namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_index_page_is_accessible()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/products');

        $response->assertStatus(200);
    }

    public function test_product_can_be_created()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/products', [
            'name' => 'Test Product',
            'price' => 100,
            'description' => 'Test Description',
        ]);

        $response->assertRedirect('/products');
        $this->assertDatabaseHas('products', ['name' => 'Test Product']);
    }

    public function test_product_can_be_updated()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user)->put("/products/{$product->id}", [
            'name' => 'Updated Product',
            'price' => 200,
            'description' => 'Updated Description',
        ]);

        $response->assertRedirect('/products');
        $this->assertDatabaseHas('products', ['name' => 'Updated Product']);
    }

    public function test_product_can_be_deleted()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user)->delete("/products/{$product->id}");

        $response->assertRedirect('/products');
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
