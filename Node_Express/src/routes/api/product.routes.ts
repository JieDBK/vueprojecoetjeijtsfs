import express from "express";
import { addProduct, getAllProduct, getProduct } from "../../controllers/api/product.controller.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getProduct);
router.post("/", addProduct)

export default router;