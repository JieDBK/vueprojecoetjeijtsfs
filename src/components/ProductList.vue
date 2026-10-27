<script setup lang="ts">
import ProductCard from './ProductCard.vue';
import type { Product } from '../types/Product';

defineProps<{
    products: Product[]
}>()

const emit = defineEmits<{
    delete: [id: number]
    edit: [product: Product]
}>()
</script>

<template>
    <p v-if="products.length === 0">The list is empty</p>
    <div v-else class="product-list">
        <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @delete="emit('delete', product.id)"
        @edit="emit('edit', product.id)"
        />
    </div>
</template>

<style>
    .product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
    }
</style>