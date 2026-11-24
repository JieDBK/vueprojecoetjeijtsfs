import express from "express";

import { loginUser, createNewUser } from "../../controllers/api/auth.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", createNewUser)

export default router;
