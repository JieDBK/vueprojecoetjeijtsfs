import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/Product'
import type { FakeStoreProduct } from '../types/FakeStoreProduct'

const products = ref<Product[]>(JSON.parse(localStorage.getItem('products') || '[]')) //dit zet json tekst formaat products om in object products
const lastSaved = ref<string | null>(null)
const expensiveProduct = ref<Product | null>(null)
const error = ref<string | null>()
const loading = ref(false)


watch(products, (latest) => {
 localStorage.setItem('products', JSON.stringify(latest)) //dit zet object products om in json tekst formaat
 lastSaved.value = new Date().toLocaleTimeString()
}, { deep: true })

watch(
 () => products.value.find(p => p.price > 1000),
 (foundProduct) => {
 if (foundProduct) {
  expensiveProduct.value = foundProduct
 }
 expensiveProduct.value = null
 }
)

export function useProducts() {
  const hasUnsavedChanges = ref(false)

  const productCount = computed(() => {
    return products.value.length
  })

  const totalValue = computed(() => {
    return products.value.reduce((sum, p) => sum + p.price, 0)
  })

  watch(
    () => totalValue.value,
    (newTotal) => {
    if (newTotal >= 5000)
    console.log('The total value is above $5000')}
    
  )

  watch(products, () => {hasUnsavedChanges.value = true}, {deep: true}) //als products verandert dan gaat unsavedchanges op true

  function addProduct(name: string, price: number, description: string, stock: number, category: string, image?: string) {
  const newProduct: Product = {
        id: Date.now(), // Simple temporary ID - in real apps, the backend generates this
        name,
        price,
        description,
        stock, 
        category,
        ...(image ? { image } : {})
    }

    products.value.push(newProduct)
    }

  function updateProduct(editingProduct: Product) {  
  // Find and update the product
  const product = products.value.find(p => p.id === editingProduct.id)
    if (product) {
        product.name = editingProduct.name
        product.price = editingProduct.price
        product.description = editingProduct.description
        product.stock = editingProduct.stock
        product.category = editingProduct.category
        if (editingProduct.image) {
          product.image = editingProduct.image
        } else {
          delete product.image
        }
    }
    }

    function deleteProduct(id: number) {
        products.value = products.value.filter(p => p.id !== id)
    }

    function getProduct(id: number) :Product | undefined {
      return products.value.find(p => p.id === id)
    }


    async function fetchProducts(){

      if (loading.value) return

      loading.value = true;
      error.value = null
      try
      {
      const response = await fetch('https://fakestoreapi.com/products')
      console.log('fetch products')
      if (!response.ok)
      {
        throw new Error('Request failed with status ${response.status}')
      }
      const data: FakeStoreProduct[] = await response.json()
      products.value = data.map(item => ({
        id: item.id,
        name: item.title,
        price: item.price,
        image: item.image,
        description: item.description,
        category: item.category,
        stock: 0
        }))
      }
      catch(err)
      {
        error.value = err instanceof Error ? err.message : 'An unknown error occurred'
      } 
      finally{
        loading.value = false;
      }


    }

    async function initProduct()
    {
      if (localStorage.getItem('products') === null)
      {
        await fetchProducts()
      }
    }


     return {
        products,
        productCount,
        totalValue,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        lastSaved,
        hasUnsavedChanges,
        initProduct,
        loading,
        error
    } 
}