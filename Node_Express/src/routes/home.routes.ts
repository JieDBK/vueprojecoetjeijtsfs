import express from "express";
import type { Request, Response } from 'express';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
 res.send("Hello! Welcome to my Express + TypeScript server");
});

router.get("/bye", (req: Request, res: Response) => {
 res.send("DOei");
});

export default router;