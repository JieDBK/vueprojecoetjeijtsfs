import {AppDataSource} from "../data-source.js"
import { Category } from "../models/Category.js";
import {Product} from "../models/Product.js"

async function seedProducts() {
  const categoryRepository = AppDataSource.getRepository(Category);
  const count = await categoryRepository.count();
  if (count > 0) return;

  const bookCategory = await categoryRepository.findOneBy({name: "Books"})
  if (bookCategory) {
    const products: Product[] = [
      new Product("The Hobbit", "Adventure book", 15, bookCategory),
      new Product("Koen Kampioen", "Football book", 12, bookCategory),
      new Product("3 Body Problem", "Weird sci-fi book", 15, bookCategory)
    ]

    products.forEach((product) => {
      product.category = bookCategory
    })
    await categoryRepository.save(products);
    
  }
}
export {seedProducts}