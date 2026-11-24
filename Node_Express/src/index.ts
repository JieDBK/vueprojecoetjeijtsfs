import express from "express";
import type { Request, Response, NextFunction } from 'express';

import "reflect-metadata";
import { AppDataSource } from "./data-source.js";

import homeRouter from "./routes/home.routes.js";
import productRouter from "./routes/product.routes.js";
import productApiRouter from "./routes/api/product.routes.js";
import authApiRouter from './routes/api/auth.routes.js';

import cors from "cors";

import path from "node:path";
import { fileURLToPath } from "node:url";

import { seedCategories } from "./utils/category-seed.js";
import { seedProducts } from "./utils/seed-products.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(dirname, "views"));

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");

    await seedCategories();
    await seedProducts();

    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request: ${req.method} ${req.url}`);
      next();
    });

    app.use(homeRouter);
    app.use("/shop", productRouter);
    app.use("/api/products", productApiRouter);
    app.use("/api/auth", authApiRouter);

    app.use((req: Request, res: Response) => {
      res.status(404).send("<h1>404 - Page Not Found</h1>");
    });

    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      console.error("Error:", err);
      res.status(err.status ?? 500).send(err.message ?? "Internal Server Error");
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });