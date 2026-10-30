import {addProduct, getAllProducts, Product} from "../models/Product.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function showProducts(req: Request, res: Response) {

    //res.sendFile(path.join(__dirname, "..", "views", "products.html"))
    res.render("products", {products: getAllProducts()})
}

function showAddProductPage(req: Request, res: Response)
{
    res.sendFile(path.join(__dirname, "..", "views", "add-product.html"))
}

function handleAddProductPage(req: Request, res: Response)
{
    const product = req.body
    addProduct(new Product(product.name, product.description, product.price))
    res.sendFile(path.join(__dirname, "..", "views", "add-product.html"))
}
export {showProducts, showAddProductPage, handleAddProductPage}