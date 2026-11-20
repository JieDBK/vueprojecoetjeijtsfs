import type { Request, Response } from 'express';

import {Product} from "../models/Product.js"
import { Category } from '../models/Category.js';

import { AppDataSource } from "../data-source.js";

const productRepository = AppDataSource.getRepository(Product)
const categoryRepository = AppDataSource.getRepository(Category)


async function showProducts(req: Request, res: Response) {
const products = await productRepository.find({
 relations: { category: true },
});

res.render("products", { products: products });
}

function showAddProductPage(req: Request, res: Response) {
  res.render("add-product")
}

async function handleAddProduct(req: Request, res: Response) {
  const product = req.body

  if (product.name == "" || product.description == "" || product.price == "" || isNaN(product.price)) {
    res.status(400).send("Product form invalid!");
    return;
  }

 // Create a partial Product object, ready for my ORM
 const newProduct = productRepository.create({
 name: req.body.name,
 description: req.body.description,
 price: Number(req.body.price)
 })

 const bookCategory = await categoryRepository.findOneBy({
  name: "Books"
 })

 if(bookCategory) {
   newProduct.category = bookCategory
 }

 // Save it to the database, returns new product including the generated id
 const savedProduct = await productRepository.save(newProduct)
 console.log(`New product saved with id ${savedProduct.id}`)

 // Render the page again with a new message
 res.render("add-product", { message: "Product added" });
}

async function showSingleProduct(req: Request, res: Response) {
  const paramId = Number(req.params.id);
  const product = await productRepository.findOne({
  where: { id: paramId },
  relations: { category: true },
  });
  res.render("product", {product: product})
}

async function deleteProduct(req: Request, res: Response) {
  const paramId = Number(req.params.id)

  await productRepository.delete(paramId)

  res.redirect("/shop/products")
}

export {showProducts, showAddProductPage, handleAddProduct, showSingleProduct, deleteProduct }