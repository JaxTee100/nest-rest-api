import { Injectable, NotFoundException } from "@nestjs/common";
import {InjectModel} from '@nestjs/mongoose'

import { Product } from "./products.model";
import { Model } from "mongoose";

@Injectable()
export class ProductsService {
    private products: Product[] =[];


    constructor( @InjectModel('Product') private readonly productModel: Model<Product>){}

    async insertProduct(title: string, desc: string, price: number){
    
        const newProduct = new this.productModel({
            title, 
            description: desc, 
            price
        });
        const result = await newProduct.save();
        return result._id ;

    }


    async getProducts(){
        const products = await this.productModel.find().exec();
        return products.map((prod) => ({
            id: prod.id, 
            title: prod.title, 
            desc: prod.description,
            price: prod.price
         }));
    }


    async getSingleProduct(productId: string){
        const product = await this.findProduct(productId)
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price
        };
    }

    async updateProduct(productId: string, title: string, desc: string, price: number){
        const updatedProduct = await this.findProduct(productId)
        if(title){
            updatedProduct.title = title
        }
        if(desc){
            updatedProduct.description = desc;
        }
        if(price){
            updatedProduct.price = price
        }
        updatedProduct.save()
        


    }

    async deleteProduct(prodId: string){
        await this.productModel.deleteOne({id: prodId}).exec();
    }

    private async findProduct(id:string) :Promise<Product>{
        let product;
        try {
            product = await this.productModel.findById(id).exec()
        } catch (error) {
            throw new NotFoundException('Could find the product')
        }

        if(!product){
            throw new NotFoundException('Could find the product')
        }
        return product
    }

    
}