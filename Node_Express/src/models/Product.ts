import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Category.js";

@Entity()
class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    name: string;
    @Column("text")
    description: string;

    @Column("real")
    price: number;

    @ManyToOne(() => Category, (category) => category.products) category?: Category;

    constructor(name: string, desc: string, price: number, category: Category) {
    this.name = name;
    this.description = desc;
    this.price = price;
    this.category = category
 }
}

const products : Product[] = [];

function addProduct(p: Product) {
    products.push(p);
}

function getAllProducts() : Product[] {
    return products;
}

export {Product, addProduct, getAllProducts}