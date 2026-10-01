import { ref, computed, watch } from 'vue'

export interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}

// const products = ref<Product[]>([
//   { id: 1, name: "Pen", price: 12.99, description: "Blue pen", stock: 100, category: "School"},
//   { id: 2, name: "Book", price: 16.99, description: "Super adventure", stock: 200, category: "Books"},
//   { id: 3, name: "Mug", price: 7.99, description: "Big mug", stock: 0, category: "House"},
//   { id: 4, name: "Notebook", price: 6.25, description: "Large notebook", stock: 4, category: "School"},
//   { id: 5, name: "Gum", price: 3.75, description: "Good gum", stock: 300, category: "School"},
// ])

const products = ref<Product[]>(JSON.parse(localStorage.getItem('products') || '[]'))
const lastSaved = ref<string | null>(null)
const expensiveProductString = ref<string | null>(null)

watch(products, (latest) => {
 localStorage.setItem('products', JSON.stringify(latest))
 lastSaved.value = new Date().toLocaleTimeString()
}, { deep: true })


watch(products, (latest) => {
 localStorage.setItem('products', JSON.stringify(latest))
 lastSaved.value = new Date().toLocaleTimeString()
}, { deep: true })

watch(
 () => products.value.find(p => p.price > 1000),
 (expensiveProduct) => {
 if (expensiveProduct) {
 expensiveProductString.value = 'Expensive product detected:' + " " + expensiveProduct.name}
 else expensiveProductString.value = null}
)

export function useProducts() {
  const editingId = ref<number | null>(null)

  const productCount = computed(() => {
    return products.value.length
  })

  const totalValue = computed(() => {
    return products.value.reduce((sum, p) => sum + p.price, 0)
  })

  function addProduct(name: string, price: number, description: string, stock: number, category: string) {
  const newProduct: Product = {
        id: Date.now(), // Simple temporary ID - in real apps, the backend generates this
        name,
        price,
        description,
        stock, 
        category
    }

    products.value.push(newProduct)
    }

  function updateProduct(name: string, price: number, description: string, stock: number, category: string) {  
  // Find and update the product
  const product = products.value.find(p => p.id === editingId.value)
    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.stock = stock
        product.category = category
    }
    }

    function deleteProduct(id: number) {
        products.value = products.value.filter(p => p.id !== id)
    }

    return {
        products,
        editingId,
        productCount,
        totalValue,
        addProduct,
        updateProduct,
        deleteProduct,
        lastSaved,
        expensiveProductString
    } 
}