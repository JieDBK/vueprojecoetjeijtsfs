<script setup lang="ts">
import type { Product } from '@/types/Product'

interface Props {
    product: Product
}

defineProps<Props>()
const emit = defineEmits<{
    delete: [id: number]
    edit: [id: number]
}>()
</script>

<template>
    <div class="product-card">
        <h2>
        <RouterLink :to="`/products/${product.id}`">
            {{ product.name }}
        </RouterLink>
        </h2>
        <p>${{ product.price.toFixed(2) }}</p>
        <p>{{ product.description }}</p>
        <label>Category: {{ product.category }}</label>
        <p v-if="product.stock <= 0" class="out-of-stock">Out of Stock!</p>
        <p v-else-if="product.stock > 0 && product.stock < 5" class="low-stock">Low Stock!</p>
        <button @click="emit('edit', product.id)" class="edit">Edit</button>
        <button @click="emit('delete', product.id)" class="secondary">Delete</button>
    </div>
</template>

<style scoped>
    .product-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1rem;
    text-align: center;
    }

    .out-of-stock {
        color: red
    }

    .low-stock {
        color: orange
    }
</style>
