import { Body, Controller, Get, HttpStatus, Logger, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { CreateProductDto } from './create-product.dto';
import { Response } from "express";
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

    constructor(
        private productService: ProductsService
    ) { }

    @Post()
    async createClient(@Body() createClientDto: CreateProductDto, @Res() res: Response) {
        const product = await this.productService.createOne(createClientDto);        
        if (!product) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'product not created',
                status: 'error'
            });
        }

        setTimeout(() => {
           return res.status(HttpStatus.CREATED).json({
                message: 'product created',
                status: 'ok',
                product
            });
        }, 2000);
    }

    @Get()
    async listAllClientWhitPersonRelation(@Res() res: Response) {
        const products = await this.productService.findAllWithPersonRelation();
        return res.status(HttpStatus.OK).json({
            message: 'all products',
            status: 'ok',
            total_products: products.length,
            products
        });
    }

    @Get(':id')
    async getOneClient(@Param('id') productId: number, @Res() res: Response) {
        const product = await this.productService.findOne(productId);
        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'product not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'product found',
            status: 'ok',
            product
        });
    }

    @Put()
    async updateClient(@Body() createClientDto: CreateProductDto, @Res() res: Response) {
        const product = await this.productService.update(createClientDto);
        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'product not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'product update',
            status: 'ok',
            product
        });
    }

    @Patch(':id')
    async switchActive(@Param('id') productId, @Res() res: Response) {
        const product = await this.productService.switchActive(productId);
        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'product not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'product update',
            status: 'ok',
            product
        });
    }

}
