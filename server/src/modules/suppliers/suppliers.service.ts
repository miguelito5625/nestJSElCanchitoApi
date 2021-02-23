import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AddressEntity } from '../database/entities/address.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { SupplierEntity } from '../database/entities/supplier.entity';
import { CreateSupplierDto } from './create-supplier.dto';

@Injectable()
export class SuppliersService {

    constructor(
        @InjectRepository(AddressEntity)
        private addressRepository: Repository<AddressEntity>,
        @InjectRepository(PersonEntity)
        private personRepository: Repository<PersonEntity>,
        @InjectRepository(SupplierEntity)
        private suppliersRepository: Repository<SupplierEntity>,
        private connection: Connection
      ) {
    
      }


      async createOne(createSupplierDto: CreateSupplierDto) {

        const personEntity = new PersonEntity();
        personEntity.generate(createSupplierDto);
        const addressEntity = new AddressEntity();
        addressEntity.generate(createSupplierDto);
        let supplierEntity = new SupplierEntity();
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const address = await queryRunner.manager.save(addressEntity);
          personEntity.address = address;
          const person = await queryRunner.manager.save(personEntity);
          supplierEntity.person = person;
          supplierEntity = await queryRunner.manager.save(supplierEntity);
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error on create supplier');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
          return null;
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return supplierEntity;
    
      }
    
      async findAll(): Promise<SupplierEntity[]> {
        return await this.suppliersRepository.find();
      }
    
      async findAllWithPersonRelation(): Promise<SupplierEntity[]> {
        return await this.suppliersRepository.find({ relations: ["person", "person.address"] });
      }
    
      async findOne(id: number): Promise<SupplierEntity> {
        return await this.suppliersRepository.findOne({
          where: { id },
          relations: ['person', 'person.address'],
        });
      }
    
    
      async update(createSupplierDto: CreateSupplierDto): Promise<SupplierEntity> {
        const supplier = await this.suppliersRepository.findOne({
          where: { id: createSupplierDto.id },
          relations: ['person', 'person.address'],
        });
    
        if (!supplier) {
          return null;
        }
    
        const person = supplier.person;
        const address = person.address;
        address.generate(createSupplierDto);
        person.generate(createSupplierDto);
    
        // supplier.firstName = createSupplierDto.firstName;
        // supplier.lastName = createSupplierDto.lastName;    
    
        const queryRunner = this.connection.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const updateAddress = await queryRunner.manager.save(address);
          person.address = updateAddress;
          const updatePerson = await queryRunner.manager.save(person);
          supplier.person = updatePerson;
          await queryRunner.manager.save(supplier);
    
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error update supplier');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return supplier;
    
      }
    
    
      async switchActive(supplierId: number): Promise<SupplierEntity> {
    
        const supplier = await this.suppliersRepository.findOne({
          where: { id: supplierId },
          relations: ['person', 'person.address'],
        });
    
        if (!supplier) {
          return null;
        }
    
        const person = await this.personRepository.findOne({
          where: { id: supplier.person.id },
          relations: ['address'],
        });
        person.isActive = !person.isActive;
        
        const queryRunner = this.connection.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const updatePerson = await queryRunner.manager.save(person);
          supplier.person = updatePerson;
    
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error update supplier');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return supplier;
    
      }

}
