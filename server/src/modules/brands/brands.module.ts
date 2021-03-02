import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from '../database/entities/supplier.entity';
import { BrandEntity } from '../database/entities/brand.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { AddressEntity } from '../database/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, PersonEntity, SupplierEntity, BrandEntity, BrandEntity])],
  providers: [BrandsService],
  controllers: [BrandsController]
})
export class BrandsModule {}
