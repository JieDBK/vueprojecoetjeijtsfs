import type { Request, Response } from 'express';

import {Product} from "../../models/Product.js"
import { AppDataSource } from "../../data-source.js";
import { Like } from 'typeorm';
import { Category } from '../../models/Category.js';

const productRepository = AppDataSource.getRepository(Product)
const categoryRepository = AppDataSource.getRepository(Category)

async function getAllProduct(req: Request, res: Response) {
    const filters: any = {}
    if(req.query.categoryId) {
        filters.category = {id: Number(req.query.categoryId)}
    }

    if (req.query.name){
        filters.name = Like(`%${req.query.name}%`)
    }
    const allProducts = await productRepository.find({where: filters, relations: {category: true}});
    res.json(allProducts)
}

async function getProduct(req: Request, res: Response) {
    const paramID = Number(req.params.id)
    const product = await productRepository.findOne({relations: {category: true}, where: {id: paramID}});

    if (!product) {
        res.status(404).json({message: "Product not found"})
        return
    }
    console.log(product)
    res.json(product)
}
async function addProduct(req: Request, res: Response) {
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
 res.status(201).json(savedProduct)
}

export {getAllProduct, getProduct, addProduct}