import express from "express";
import {showHomepage} from "../controllers/home.controller.js"

const router = express.Router();

router.get("/", showHomepage)

export default router;