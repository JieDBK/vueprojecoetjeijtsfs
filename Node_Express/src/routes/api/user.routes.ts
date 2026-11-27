import express from "express";
import { getUser, getAllUsers } from "../../controllers/api/user.controller.js";
import { authenticateToken, requireAdmin, requireSelectedUser } from "../../middleware/auth.middleware.js";

const router = express.Router()

router.use(authenticateToken)

router.get("/", requireAdmin, getAllUsers)
router.get("/:id", requireAdmin, requireSelectedUser, getUser)
//router put
export default router;