import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from '../database/entities/purchase.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { PurchaseProductsProductEntity } from '../database/entities/purchase-products-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, PurchaseEntity, PurchaseProductsProductEntity])],
  providers: [PurchasesService],
  controllers: [PurchasesController]
})
export class PurchasesModule {}
