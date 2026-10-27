<!-- <script setup lang="ts">
import ProductManagementPage from './pages/ProductManagementPage.vue'

</script>

<template>
  <ProductManagementPage />
</template> -->

<script lang="ts">
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/products">Products</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView>

    </RouterView>
  </main>

</template>

<style scoped>
header {
  width: 100%;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

nav {
  padding: 1rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}

nav a {
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius);
  text-decoration: none;
}

nav a.router-link-active {
  background: var(--color-primary);
  color: var(--color-primary-text);
}

main {
  width: 80%;
  margin: auto;
}
</style>