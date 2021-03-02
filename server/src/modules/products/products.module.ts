import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../database/entities/product.entity';
import { SupplierEntity } from '../database/entities/supplier.entity';
import { BrandEntity } from '../database/entities/brand.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { AddressEntity } from '../database/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, PersonEntity, SupplierEntity, BrandEntity, ProductEntity])],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
