import express from "express";
import type { Request, Response, NextFunction } from 'express';
import homeRouter from "./routes/home.routes.js";
import productRouter from "./routes/product.routes.js";
import "reflect-metadata";
import { AppDataSource } from "./data-source.js"; // your TypeORM data source

const app = express();
const PORT = 3000;

import path from "node:path";
import { fileURLToPath } from "node:url";
import { seedCategories } from "./utils/category-seed.js";
import { seedProducts } from "./utils/seed-products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
AppDataSource.initialize()
    .then(async () => {
        console.log("Database connected");
        await seedCategories()
        await seedProducts()
        app.use(express.urlencoded({extended: true}))
        app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`Request: ${req.method} ${req.url}`);
        next(); // without this, the request would stop here
    })


    app.use(homeRouter)
    app.use("/shop", productRouter)

    app.use((req: Request, res: Response) => {
    res.status(404).send("<h1>404 - Page Not Found</h1>");
    });

    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
    });


    app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    });
 })
 .catch((error) => {
 console.error("Database connection failed:", error);
 });




