import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AddressEntity } from '../database/entities/address.entity';
import { BrandEntity } from '../database/entities/brand.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { SupplierEntity } from '../database/entities/supplier.entity';
import { CreateProductDto } from './create-product.dto';

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(SupplierEntity)
        private supplierRepository: Repository<SupplierEntity>,
        @InjectRepository(BrandEntity)
        private brandRepository: Repository<BrandEntity>,
        @InjectRepository(ProductEntity)
        private productsRepository: Repository<ProductEntity>,
        private connection: Connection
      ) {
    
      }


      async createOne(createProductDto: CreateProductDto) {

        let productEntity = new ProductEntity();

        const supplier = await this.supplierRepository.findOne({
          where: { id: createProductDto.supplierId }
        });

        const brand = await this.brandRepository.findOne({
          where: { id: createProductDto.brandId }
        });

        productEntity.generate(createProductDto, supplier, brand);


        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          productEntity = await queryRunner.manager.save(productEntity);
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error on create product');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
          return null;
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return productEntity;
    
      }
    
      async findAll(): Promise<ProductEntity[]> {
        return await this.productsRepository.find();
      }
    
      async findAllWithPersonRelation(): Promise<ProductEntity[]> {
        return await this.productsRepository.find({ relations: ["supplier", "supplier.person", "supplier.person.address", "brand"] });
      }
    
      async findOne(id: number): Promise<ProductEntity> {
        return await this.productsRepository.findOne({
          where: { id },
          relations: ["supplier", "supplier.person", "supplier.person.address", "brand"],
        });
      }
    
    
      async update(createProductDto: CreateProductDto): Promise<ProductEntity> {
        const product = await this.productsRepository.findOne({
          where: { id: createProductDto.id }
        });
    
        if (!product) {
          return null;
        }
        
        const supplier = await this.supplierRepository.findOne({
          where: { id: createProductDto.supplierId }
        });

        const brand = await this.brandRepository.findOne({
          where: { id: createProductDto.brandId }
        });

        product.generate(createProductDto, supplier, brand);

        const queryRunner = this.connection.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          
          await queryRunner.manager.save(product);
    
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error update product');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return product;
    
      }
    
    
      async switchActive(productId: number): Promise<ProductEntity> {
    
        let product = await this.productsRepository.findOne({
          where: { id: productId }
        });
    
        if (!product) {
          return null;
        }

        product.isActive = !product.isActive;
        
        const queryRunner = this.connection.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const updateProduct = await queryRunner.manager.save(product);
          product = updateProduct;
    
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error update product');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return product;
    
      }

}
