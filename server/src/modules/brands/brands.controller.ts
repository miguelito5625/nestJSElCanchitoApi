import { Body, Controller, Get, HttpStatus, Logger, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { CreateBrandDto } from './create-brand.dto';
import { Response } from "express";
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {

    constructor(
        private brandService: BrandsService
    ) { }

    @Post()
    async createClient(@Body() createClientDto: CreateBrandDto, @Res() res: Response) {
        const brand = await this.brandService.createOne(createClientDto);        
        if (!brand) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'brand not created',
                status: 'error'
            });
        }

        setTimeout(() => {
           return res.status(HttpStatus.CREATED).json({
                message: 'brand created',
                status: 'ok',
                brand
            });
        }, 2000);
    }

    @Get()
    async listAllClientWhitPersonRelation(@Res() res: Response) {
        const brands = await this.brandService.findAll();
        return res.status(HttpStatus.OK).json({
            message: 'all brands',
            status: 'ok',
            total_brands: brands.length,
            brands
        });
    }

    @Get(':id')
    async getOneClient(@Param('id') brandId: number, @Res() res: Response) {
        const brand = await this.brandService.findOne(brandId);
        if (!brand) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'brand not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'brand found',
            status: 'ok',
            brand
        });
    }

    @Put()
    async updateClient(@Body() createClientDto: CreateBrandDto, @Res() res: Response) {
        const brand = await this.brandService.update(createClientDto);
        if (!brand) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'brand not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'brand update',
            status: 'ok',
            brand
        });
    }

    @Patch(':id')
    async switchActive(@Param('id') brandId, @Res() res: Response) {
        const brand = await this.brandService.switchActive(brandId);
        if (!brand) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'brand not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'brand update',
            status: 'ok',
            brand
        });
    }

}
