import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AddressEntity } from '../database/entities/address.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(AddressEntity)
        private addressRepository: Repository<AddressEntity>,
        @InjectRepository(PersonEntity)
        private personRepository: Repository<PersonEntity>,
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private connection: Connection
      ) {
    
      }
    
      async createOne(createUserDto: CreateUserDto) {
    
        const personEntity = new PersonEntity();
        personEntity.generate(createUserDto);
        const addressEntity = new AddressEntity();
        addressEntity.generate(createUserDto);
        let userEntity = new UserEntity();
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const address = await queryRunner.manager.save(addressEntity);
          personEntity.address = address;
          const person = await queryRunner.manager.save(personEntity);
          userEntity.person = person;
          userEntity = await queryRunner.manager.save(userEntity);
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error on create user');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return userEntity;
    
      }
    
      async findAll(): Promise<UserEntity[]> {
        return await this.usersRepository.find();
      }
    
      async findAllWithPersonRelation(): Promise<UserEntity[]> {
        return await this.usersRepository.find({ relations: ["person", "person.address"] });
      }
    
      async findOne(id: number): Promise<UserEntity> {
        return await this.usersRepository.findOne({
          where: { id },
          relations: ['person', 'person.address'],
        });
      }
    
    
      async update(createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({
          where: { id: createUserDto.id },
          relations: ['person', 'person.address'],
        });
    
        if (!user) {
          return null;
        }                

        const person = user.person;        
        const address = person.address;
        address.generate(createUserDto);
        person.generate(createUserDto);  
    
        const queryRunner = this.connection.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {         
           
          const updateAddress = await queryRunner.manager.save(address);
          person.address = updateAddress;                    
          const updatePerson = await queryRunner.manager.save(person);
          user.person = updatePerson;
          await queryRunner.manager.save(user);
    
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error update user');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return user;
    
      }
    
    
      async switchActive(clientId: number): Promise<UserEntity> {
    
        const user = await this.usersRepository.findOne({
          where: { id: clientId },
          relations: ['person', 'person.address'],
        });
    
        if (!user) {
          return null;
        }
    
        const person = await this.personRepository.findOne({
          where: { id: user.person.id },
          relations: ['address'],
        });
        person.isActive = !person.isActive;
        
        const queryRunner = this.connection.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const updatePerson = await queryRunner.manager.save(person);
          user.person = updatePerson;
    
          await queryRunner.commitTransaction();
        } catch (err) {
          Logger.error('error update user');
          Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return user;
    
      }

}
