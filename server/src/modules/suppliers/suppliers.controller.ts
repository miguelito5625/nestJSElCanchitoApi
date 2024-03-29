import { Body, Controller, Get, HttpStatus, Logger, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { CreateSupplierDto } from './create-supplier.dto';
import { Response } from "express";
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {

    constructor(
        private supplierService: SuppliersService
    ) { }

    @Post()
    async createSupplier(@Body() createSupplierDto: CreateSupplierDto, @Res() res: Response) {
        const supplier = await this.supplierService.createOne(createSupplierDto);        
        if (!supplier) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'supplier not created',
                status: 'error'
            });
        }

        setTimeout(() => {
           return res.status(HttpStatus.CREATED).json({
                message: 'supplier created',
                status: 'ok',
                supplier
            });
        }, 2000);
    }

    @Get()
    async listAllSupplierWhitPersonRelation(@Res() res: Response) {
        const suppliers = await this.supplierService.findAllWithRelation();
        return res.status(HttpStatus.OK).json({
            message: 'all suppliers',
            status: 'ok',
            total_suppliers: suppliers.length,
            suppliers
        });
    }

    @Get(':id')
    async getOneSupplier(@Param('id') supplierId: number, @Res() res: Response) {
        const supplier = await this.supplierService.findOne(supplierId);
        if (!supplier) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'supplier not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'supplier found',
            status: 'ok',
            supplier
        });
    }

    @Put()
    async updateSupplier(@Body() createSupplierDto: CreateSupplierDto, @Res() res: Response) {
        const supplier = await this.supplierService.update(createSupplierDto);
        if (!supplier) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'supplier not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'supplier update',
            status: 'ok',
            supplier
        });
    }

    @Patch(':id')
    async switchActive(@Param('id') supplierId, @Res() res: Response) {
        const supplier = await this.supplierService.switchActive(supplierId);
        if (!supplier) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'supplier not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'supplier update',
            status: 'ok',
            supplier
        });
    }

}
