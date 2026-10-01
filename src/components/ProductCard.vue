<script setup lang="ts">
interface Props {
    id: number
    name: string
    price: number
    description: string
    stock: number
    category: string
}

defineProps<Props>()
const emit = defineEmits<{
    delete: [id: number]
    edit: [id: number]
}>()
</script>

<template>
    <div class="product-card">
        <h3>{{ name }} ({{ id }})</h3>
        <p>${{ price.toFixed(2) }}</p>
        <p>{{ description }}</p>
        <label>Category: {{ category }}</label>
        <p v-if="stock <= 0" class="out-of-stock">Out of Stock!</p>
        <p v-else-if="stock > 0 && stock < 5" class="low-stock">Low Stock!</p>
        <button @click="emit('edit', id)" class="edit">Edit</button>
        <button @click="emit('delete', id)" class="secondary">Delete</button>
    </div>
</template>

<style scoped>
    .product-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1rem;
    }

    .out-of-stock {
        color: red
    }

    .low-stock {
        color: orange
    }
</style>
