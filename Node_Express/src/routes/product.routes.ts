import express from "express";
import type { Request, Response } from 'express';

const router = express.Router();

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/products", (req: Request, res: Response) => {
 res.sendFile(path.join(__dirname, "..", "views", "products.html"))
});


router.get("/add-product", (req: Request, res: Response) => {
 res.send("Here you can add a product");
});

router.get("/products", (req: Request, res: Response) => {
 res.send("All products are displayed here.");
});

export default router;