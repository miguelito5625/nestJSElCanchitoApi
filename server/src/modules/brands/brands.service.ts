import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BrandEntity } from '../database/entities/brand.entity';
import { CreateBrandDto } from './create-brand.dto';

@Injectable()
export class BrandsService {

    constructor(
        @InjectRepository(BrandEntity)
        private brandsRepository: Repository<BrandEntity>,
        private connection: Connection
      ) {
    
      }


      async createOne(createBrandDto: CreateBrandDto) {

        let brandEntity = new BrandEntity();

        brandEntity.generate(createBrandDto);


        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          brandEntity = await queryRunner.manager.save(brandEntity);
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error on create brand');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
          return null;
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return brandEntity;
    
      }
    
      async findAll(): Promise<BrandEntity[]> {
        return await this.brandsRepository.find();
      }
    
      // async findAllWithRelation(): Promise<BrandEntity[]> {
      //   return await this.brandsRepository.find({ relations: ["supplier", "supplier.person", "supplier.person.address", "brand"] });
      // }
    
      async findOne(id: number): Promise<BrandEntity> {
        return await this.brandsRepository.findOne({
          where: { id }
        });
      }
    
    
      async update(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
        const brand = await this.brandsRepository.findOne({
          where: { id: createBrandDto.id }
        });
    
        if (!brand) {
          return null;
        }

        brand.generate(createBrandDto);

        const queryRunner = this.connection.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          
          await queryRunner.manager.save(brand);
    
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error update brand');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return brand;
    
      }
    
    
      async switchActive(brandId: number): Promise<BrandEntity> {
    
        let brand = await this.brandsRepository.findOne({
          where: { id: brandId }
        });
    
        if (!brand) {
          return null;
        }

        brand.isActive = !brand.isActive;
        
        const queryRunner = this.connection.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const updateBrand = await queryRunner.manager.save(brand);
          brand = updateBrand;
    
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error update brand');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return brand;
    
      }

}
