import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ProductEntity } from '../database/entities/product.entity';
import { PurchaseProductsProductEntity } from '../database/entities/purchase-products-product.entity';
import { PurchaseEntity } from '../database/entities/purchase.entity';
import { CreatePurchaseDto } from './create-purchase.dto';

@Injectable()
export class PurchasesService {

    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
        @InjectRepository(PurchaseEntity)
        private purchaseRepository: Repository<PurchaseEntity>,
        @InjectRepository(PurchaseProductsProductEntity)
        private purchaseProductsProductRepository: Repository<PurchaseProductsProductEntity>,
        private connection: Connection
      ) {
    
      }


      async createOne(createPurchaseDto: CreatePurchaseDto) {

        const purchaseEntity = new PurchaseEntity();
        purchaseEntity.generate(createPurchaseDto);
        let purchase;
        let productsInPurchase = [];
        
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          purchase = await queryRunner.manager.save(purchaseEntity);
          
          for (let index = 0; index < createPurchaseDto.purchaseProducts.length; index++) {
            const productId = createPurchaseDto.purchaseProducts[index].productId;
            const quantityProduct = createPurchaseDto.purchaseProducts[index].quantity;
            const product = await this.productRepository.findOne({
              where: { id: productId }
            });
            let purchaseProductsProduct = new PurchaseProductsProductEntity();
            purchaseProductsProduct.product = product;
            purchaseProductsProduct.productQuantity = quantityProduct;
            purchaseProductsProduct.purchase = purchase;
            const addProductToPurchase = await queryRunner.manager.save(purchaseProductsProduct);
            productsInPurchase.push(addProductToPurchase);
          }

          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error on create purchase');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
          return null;
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return purchase;
    
      }
    
      // async findAll(): Promise<PurchaseEntity[]> {
      //   return await this.purchaseProductsProductRepository.find();
      // }
    
      async findAllWithRelation(): Promise<PurchaseEntity[]> {
        return await this.purchaseRepository.find({ relations: ["productsInPurchase", "productsInPurchase.product"] });
      }
    
      async findOne(id: number): Promise<PurchaseEntity> {
        return await this.purchaseRepository.findOne({
          where: { id },
          relations: ['productsInPurchase', 'productsInPurchase.product'],
        });
      }
    
    
      // async update(createPurchaseDto: CreatePurchaseDto): Promise<PurchaseEntity> {
      //   const purchase = await this.purchaseProductsProductRepository.findOne({
      //     where: { id: createPurchaseDto.id },
      //     relations: ['person', 'person.address'],
      //   });
    
      //   if (!purchase) {
      //     return null;
      //   }
    
      //   const person = purchase.person;
      //   const address = person.address;
      //   address.generate(createPurchaseDto);
      //   person.generate(createPurchaseDto);
    
      //   // purchase.firstName = createPurchaseDto.firstName;
      //   // purchase.lastName = createPurchaseDto.lastName;    
    
      //   const queryRunner = this.connection.createQueryRunner();
    
      //   await queryRunner.connect();
      //   await queryRunner.startTransaction();
      //   try {
      //     const updateAddress = await queryRunner.manager.save(address);
      //     person.address = updateAddress;
      //     const updatePerson = await queryRunner.manager.save(person);
      //     purchase.person = updatePerson;
      //     await queryRunner.manager.save(purchase);
    
      //     await queryRunner.commitTransaction();
      //   } catch (err) {
      //     Logger.error('error update purchase');
      //     Logger.error(err);
      //     // since we have errors lets rollback the changes we made
      //     await queryRunner.rollbackTransaction();
      //   } finally {
      //     // you need to release a queryRunner which was manually instantiated
      //     await queryRunner.release();
      //   }
    
      //   return purchase;
    
      // }
    
    
      // async switchActive(purchaseId: number): Promise<PurchaseEntity> {
    
      //   const purchase = await this.purchaseProductsProductRepository.findOne({
      //     where: { id: purchaseId },
      //     relations: ['person', 'person.address'],
      //   });
    
      //   if (!purchase) {
      //     return null;
      //   }
    
      //   const person = await this.purchaseRepository.findOne({
      //     where: { id: purchase.person.id },
      //     relations: ['address'],
      //   });
      //   person.isActive = !person.isActive;
        
      //   const queryRunner = this.connection.createQueryRunner();
    
      //   await queryRunner.connect();
      //   await queryRunner.startTransaction();
      //   try {
      //     const updatePerson = await queryRunner.manager.save(person);
      //     purchase.person = updatePerson;
    
      //     await queryRunner.commitTransaction();
      //   } catch (err) {
      //     Logger.error('error update purchase');
      //     Logger.error(err);
      //     // since we have errors lets rollback the changes we made
      //     await queryRunner.rollbackTransaction();
      //   } finally {
      //     // you need to release a queryRunner which was manually instantiated
      //     await queryRunner.release();
      //   }
    
      //   return purchase;
    
      // }

}
