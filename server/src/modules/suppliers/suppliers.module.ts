import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '../database/entities/address.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { SupplierEntity } from '../database/entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, PersonEntity, SupplierEntity])],
  providers: [SuppliersService],
  controllers: [SuppliersController]
})
export class SuppliersModule {}
