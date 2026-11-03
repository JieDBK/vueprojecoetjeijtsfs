import {Product} from "../models/Product.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response } from 'express';

import { AppDataSource } from "../data-source.js";
const productRepository = AppDataSource.getRepository(Product)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function showProducts(req: Request, res: Response) {
 const products: Product[] = await productRepository.find();
 console.log(`Number of products found: ${products.length}`);
 res.render("products", { products: products });
}


function showAddProductPage(req: Request, res: Response)
{
    res.sendFile(path.join(__dirname, "..", "views", "add-product.html"))
}

async function handleAddProductPage(req: Request, res: Response)
{
    const product = req.body
    // addProduct(new Product(product.name, product.description, product.price))
    const newProduct = productRepository.create({
        name: product.name,
        description: product.description,
        price: product.price
    })

    const savedProduct = await productRepository.save(newProduct)
    console.log(savedProduct.id)
    res.sendFile(path.join(__dirname, "..", "views", "add-product.html"))
}
export {showProducts, showAddProductPage, handleAddProductPage}