import express from "express";
import { addProduct, getAllProduct, getProduct } from "../../controllers/api/product.controller.js";
import { authenticateToken, requireAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllProduct);
router.get("/:id", getProduct);
router.post("/", addProduct)

router.post("/", requireAdmin, addProduct)
export default router;