<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { ref, computed } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
onMounted(() => {
  console.log('onMounted is ready!')
  console.log('# products: ', products.value.length)
})

console.log('MY MESSAGE TOO SOON?!')
// console.log('# products: ', products.value.length)

import { useProducts } from '../composables/useProducts'

const {
  products,
  editingId,
  productCount,
  totalValue,
  addProduct: addToProducts,
  updateProduct: updateInProducts,
  deleteProduct,
  lastSaved,
  expensiveProductString
} = useProducts()


const newProductName = ref<string>('')
const newProductPrice = ref<number>(0)
const newProductDescription = ref<string>('')
const newProductStock = ref<number>(0)
const newProductCategory = ref<string>('')

const formError = ref('')

function addProduct() {
  if (newProductName.value.trim() === '' || newProductPrice.value <= 0) {
    formError.value = "Please fill in all fields"
    return
  }

  addToProducts(newProductName.value, newProductPrice.value, newProductDescription.value, newProductStock.value, newProductCategory.value)  

  newProductName.value = ''
  newProductPrice.value = 0
  newProductDescription.value = ''
  newProductStock.value = 0
  newProductCategory.value = ''
  formError.value = ''
}

function updateProduct() {
  // Validate
  if (newProductName.value.trim() === '' || newProductPrice.value <= 0) {
    formError.value = "Please fill in all fields"
    return
  }
  
  updateInProducts(newProductName.value, newProductPrice.value, newProductDescription.value, newProductStock.value, newProductCategory.value)
  // Reset form and exit edit mode
  editingId.value = null
  newProductName.value = ''
  newProductPrice.value = 0
  newProductDescription.value = ''
  newProductStock.value = 0
  newProductCategory.value = ''
  formError.value = ''
}

function startEditing(product: Product) {
  editingId.value = product.id
  newProductName.value = product.name
  newProductPrice.value = product.price
  newProductDescription.value = product.description
  newProductStock.value = product.stock
  newProductCategory.value = product.category
}

interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}

function cancelEdit() {
 editingId.value = null // or 0, depending on how you typed the ref()
 newProductName.value = ''
 newProductPrice.value = 0
}

function handleKeyPress(event: KeyboardEvent) {
 if (event.key === 'Escape' && editingId.value !== null) {
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


</script>

<template>
  <form @submit.prevent="editingId ? updateProduct() : addProduct()">
    <h2>{{ editingId ? 'Edit Product' : 'Add New Product' }}</h2>
    
    <label>
      Product Name
      <input v-model="newProductName" type="text">
    </label>
    
    <label>
      Price
      <input v-model.number="newProductPrice" type="number">
    </label>

    <label>
      Description
      <input v-model.number="newProductDescription" type="text">
    </label>

    <label>
      Stock
      <input v-model.number="newProductStock" type="number">
    </label>

    <label>
      Category
      <select v-model.number="newProductCategory">
        <option disabled value="">--Please choose a category--</option>
        <option>School</option>
        <option>House</option>
        <option>Books</option>
      </select>
    </label>

  <button type="submit">
    {{ editingId ? 'Update Product' : 'Add Product' }}
  </button>
  <button
    v-if="editingId"
    type="button"
    @click="cancelEdit">
    Cancel
  </button>
    <p v-if="formError" class="form-error">{{ formError }}</p>
  </form>
  
  <div class="stats">
    <div class="stat">
      <strong>Products:</strong> {{ productCount }}
    </div>
    <div class="stat">
      <strong>Total Value:</strong> ${{ totalValue.toFixed(2) }}
      <p v-if="expensiveProductString">{{ expensiveProductString }}</p>
    </div>
  </div>

  <div v-if="lastSaved">Last saved: {{ lastSaved }}</div>

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
    @edit = "startEditing(product)"
    @delete="deleteProduct"
    />
  </div>
</template>

<style scoped>
h1 {
  color: #42b983
}

.warning {
  color: red
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.form-error {
  color: red
}

.stat {
  margin: 1rem;
}
</style>