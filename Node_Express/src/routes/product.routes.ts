import express from "express";

import {showProducts, showAddProductPage, handleddProductPage} from "../controllers/product.controller.js";
const router = express.Router();

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/products", showProducts)
router.get("/add-product", showAddProductPage)
router.get("/add-product", handleddProductPage)




export default router;