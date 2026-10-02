<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ProductForm from '../components/ProductForm.vue'
import type { Product } from '../types/Product.ts'
onMounted(() => {
  console.log('onMounted is ready!')
  console.log('# products: ', products.value.length)
})

console.log('MY MESSAGE TOO SOON?!')
// console.log('# products: ', products.value.length)

import { useProducts } from '../composables/useProducts.ts'

const {
  products,
  productCount,
  totalValue,
  addProduct: addToProducts,
  updateProduct: updateInProducts,
  deleteProduct,
  lastSaved,
  hasUnsavedChanges,
} = useProducts()


function handleAdd(
  name: string,
  price: number,
  description: string,
  stock: number,
  category: string,
) {
  addToProducts(name, price, description, stock, category)
}

function handleUpdate(product: Product) {
  updateInProducts(product)
  cancelEdit()
}

function saveAll() {
  localStorage.setItem('products', JSON.stringify(products.value))
  hasUnsavedChanges.value = false
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Escape' && editingProduct.value !== null) {
    cancelEdit()
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
  console.log('Cleaned up keyboard listener')
})

const editingProduct = ref<Product | null>(null)

function startEditing(product: Product) {
  editingProduct.value = product
}
function cancelEdit() {
  editingProduct.value = null
}
</script>

<template>
  <div class="stats">
    <div class="stat"><strong>Products:</strong> {{ productCount }}</div>
    <div class="stat"><strong>Total Value:</strong> ${{ totalValue.toFixed(2) }}</div>
    <div v-if="lastSaved">Last saved: {{ lastSaved }}</div>
    <div>
      <p v-if="hasUnsavedChanges" class="warning">You have unsaved changes!</p>
      <button type="button" @click="saveAll">Save all</button>
    </div>
  </div>

  <div class="product-list">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :id="product.id"
      :name="product.name"
      :price="product.price"
      :description="product.description"
      :stock="product.stock"
      :category="product.category"
      @add="addToProducts"
      @delete="deleteProduct"
      @edit="startEditing(product)"
      @cancel="cancelEdit"
    />
  </div>
  <ProductForm
    :editing-product="editingProduct"
    @add="handleAdd"
    @update="handleUpdate"
    @cancel="cancelEdit"
  >
  </ProductForm>
</template>

<style scoped>
h1 {
  color: #42b983;
}

.warning {
  color: red;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.form-error {
  color: red;
}

.stat {
  margin: 1rem;
}
</style>