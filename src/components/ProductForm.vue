<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product } from '../types/Product'

const props = defineProps<{
 editingProduct: Product | null
}>()

const newProductName = ref<string>('')
const newProductPrice = ref<number>(0)
const newProductDescription = ref<string>('')
const newProductStock = ref<number>(0)
const newProductCategory = ref<string>('')
const newProductImage = ref<string>('')
const formError = ref('')

watch(() => props.editingProduct, (product) => {
    if (product) {
    newProductName.value = product.name
    newProductPrice.value = product.price
    newProductDescription.value = product.description
    newProductStock.value = product.stock
    newProductCategory.value = product.category
    newProductImage.value = product.image ?? ''
    } else {
    newProductName.value = ''
    newProductPrice.value = 0
    newProductDescription.value = ''
    newProductStock.value = 0
    newProductCategory.value = ''
    newProductImage.value = ''
    }
}, { immediate: true })

const emit = defineEmits<{
 add: [
    name: string,
    price: number,
    description: string,
    stock: number,
    category: string,
    image?: string
]
update: [product: Product]
cancel: []
}>()

function handleSubmit() {
    if (props.editingProduct) {
    // create new product, never adjust the props
    const updated: Product = {
        id: props.editingProduct.id,
        name: newProductName.value,
        price: newProductPrice.value,
        description: newProductDescription.value,
        category: newProductCategory.value,
        stock: newProductStock.value,
        ...(newProductImage.value.trim() ? { image: newProductImage.value.trim() } : {})
    }
    emit('update', updated)
    } else {
        if (newProductName.value.trim() === '' || newProductPrice.value <= 0) {
            formError.value = 'Please fill in all fields'
        return
        }
    emit('add', 
        newProductName.value, 
        newProductPrice.value, 
        newProductDescription.value, 
        newProductStock.value, 
        newProductCategory.value,
        newProductImage.value.trim() || undefined)

        newProductName.value = ''
        newProductPrice.value = 0
        newProductDescription.value = ''
        newProductStock.value = 0
        newProductCategory.value = ''
        newProductImage.value = ''
        formError.value = ''
    }
    emit ('cancel')
}

</script>

<template>
 <form @submit.prevent="handleSubmit">
    <h2>{{ props.editingProduct ? 'Edit Product' : 'Add Product' }}</h2>

    <label>
      Product Name
      <input v-model="newProductName" type="text" />
    </label>

    <label>
      Price
      <input v-model.number="newProductPrice" type="number" />
    </label>

    <label>
      Description
      <input v-model.number="newProductDescription" type="text" />
    </label>

    <label>
      Stock
      <input v-model.number="newProductStock" type="number" />
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

    <label>
      Image URL (optional)
      <input v-model="newProductImage" type="url" />
    </label>

    <button type="submit">
      {{ props.editingProduct ? 'Update Product' : 'Add Product' }}
    </button>
    <button type="button" v-if="props.editingProduct != null" @click="emit('cancel')">
      {{ 'Cancel' }}
    </button>

    <!-- <button type="button" v-if="props.editingProduct !== null" @click="cancelEdit">Cancel edit</button> -->

    <p v-if="formError" class="form-error">{{ formError }}</p>
  </form>
</template>

<style>
    .form-error {
    color: red;
    }
</style>