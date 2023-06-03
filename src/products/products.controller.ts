import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}
     @Post()
    //the paranthesis contains all these variables and their types because you have  to post these values
    async addProduct(
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number
        ) {
          const generatedId = await this.productsService.insertProduct(prodTitle, prodDesc, prodPrice);
          return {id: generatedId};
    }

    //required to get everything that has been saved
    @Get()
    async getAllProducts(){
        const products = await this.productsService.getProducts()
        return products
        
    }


    //here the param decorator is used because a particular product is required
    @Get(':id')
    async getProduct(@Param('id') prodId: string){
        return await this.productsService.getSingleProduct(prodId)
    }

    //pick one element and update its values
    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number

        ){
        await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice)
        return "Updated"
    }

    @Delete(':id')
    async removeProduct(@Param('id') prodId: string,){
        await this.productsService.deleteProduct(prodId);
        return "deleted"
    }
}
