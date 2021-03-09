import { Body, Controller, Get, HttpStatus, Logger, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { CreatePurchaseDto } from './create-purchase.dto';
import { Response } from "express";
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController {

    constructor(
        private purchaseService: PurchasesService
    ) { }

    @Post()
    async createPurchase(@Body() createPurchaseDto: CreatePurchaseDto, @Res() res: Response) {
        const purchase = await this.purchaseService.createOne(createPurchaseDto);
        if (!purchase) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'purchase not created',
                status: 'error'
            });
        }        

        return res.status(HttpStatus.CREATED).json({
            message: 'purchase created',
            status: 'ok',
            purchase
        });

    }

    @Get()
    async listAllPurchaseWhitRelation(@Res() res: Response) {
        const purchases = await this.purchaseService.findAllWithRelation();
        return res.status(HttpStatus.OK).json({
            message: 'all purchases',
            status: 'ok',
            total_purchases: purchases.length,
            purchases
        });
    }

    @Get(':id')
    async getOnePurchase(@Param('id') purchaseId: number, @Res() res: Response) {
        const purchase = await this.purchaseService.findOne(purchaseId);
        if (!purchase) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'purchase not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'purchase found',
            status: 'ok',
            purchase
        });
    }

    // @Put()
    // async updatePurchase(@Body() createPurchaseDto: CreatePurchaseDto, @Res() res: Response) {
    //     const purchase = await this.purchaseService.update(createPurchaseDto);
    //     if (!purchase) {
    //         return res.status(HttpStatus.NOT_FOUND).json({
    //             message: 'purchase not found',
    //             status: 'error'
    //         });
    //     }
    //     return res.status(HttpStatus.OK).json({
    //         message: 'purchase update',
    //         status: 'ok',
    //         purchase
    //     });
    // }

    // @Patch(':id')
    // async switchActive(@Param('id') purchaseId, @Res() res: Response) {
    //     const purchase = await this.purchaseService.switchActive(purchaseId);
    //     if (!purchase) {
    //         return res.status(HttpStatus.NOT_FOUND).json({
    //             message: 'purchase not found',
    //             status: 'error'
    //         });
    //     }
    //     return res.status(HttpStatus.OK).json({
    //         message: 'purchase update',
    //         status: 'ok',
    //         purchase
    //     });
    // }

}
