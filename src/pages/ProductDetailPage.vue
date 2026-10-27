<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { onMounted, computed } from 'vue'
const route = useRoute()
const { getProduct, initProduct, error, loading} = useProducts()
 
const productId = Number(route.params.id)
const product = computed(() => getProduct(productId))

onMounted(() => {
    initProduct()
})
</script>
 
<template>
    <div v-if="product">
        <h1>{{ product.name }}</h1>
        <img v-if="product.image" :src="product.image" :alt="product.name">
        <p>Price: ${{ product.price }}</p>
        <RouterLink to="/products">← Back to Products</RouterLink>
    </div>
    <div v-else>
        <p v-if="loading">Loading...</p>
        <h1>{{ error }}</h1>
        <h1>Product Not Found</h1>
        <p>No product exists with ID {{ productId }}.</p>
        <RouterLink to="/products">← Back to Products</RouterLink>
    </div>
</template>