import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ClientEntity } from '../database/entities/client.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { CreateClientDto } from './create-client.dto';

@Injectable()
export class ClientsService {

    constructor(
        @InjectRepository(PersonEntity)
        private personEntitysRepository: Repository<PersonEntity>,
        @InjectRepository(ClientEntity)
        private clientsRepository: Repository<ClientEntity>,
        private connection: Connection
    ) {

    }

    async createOne(createClientDto: CreateClientDto){

        const personEntity = new PersonEntity();
        personEntity.generate(createClientDto);
        let clientEntity = new ClientEntity();
        const queryRunner = this.connection.createQueryRunner();    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const person = await queryRunner.manager.save(personEntity);
          clientEntity.person = person;
          clientEntity = await queryRunner.manager.save(clientEntity);
          await queryRunner.commitTransaction();
        } catch (err) {
            Logger.error('error on create client');
            Logger.error(err);
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
    
        return clientEntity;

    }

    async findAll(): Promise<ClientEntity[]> {
      return await this.clientsRepository.find();
    }

    async findAllWithPersonRelation(): Promise<ClientEntity[]> {
      return await this.clientsRepository.find({ relations: ["person"] });
    }

    async findOne(id: number): Promise<ClientEntity> {
      return await this.clientsRepository.findOne({
        where: { id },
        relations: ['person'],
      });
    }


    async update(createClientDto: CreateClientDto): Promise<ClientEntity> {
      const client = await this.clientsRepository.findOne({
        where: { id: createClientDto.id },
        relations: ['person'],
      });
      
      if (!client) {
        return null;
      }

      const person = await this.personEntitysRepository.findOne(client.person.id);      
      person.generate(createClientDto);

      // client.firstName = createClientDto.firstName;
      // client.lastName = createClientDto.lastName;    
  
      const queryRunner = this.connection.createQueryRunner();
  
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const updatePerson = await queryRunner.manager.save(person);
        client.person = updatePerson;
        await queryRunner.manager.save(client);

        await queryRunner.commitTransaction();
      } catch (err) {            
        Logger.error('error update client');
        Logger.error(err);
        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
  
      return client;
  
    }


    async switchActive(personId: number): Promise<PersonEntity> {
   
      const person = await this.personEntitysRepository.findOne(personId);
      
      const isActive = !person.isActive;
         
      if (!person) {
        return null;
      }

      person.isActive = isActive;

      // client.firstName = createClientDto.firstName;
      // client.lastName = createClientDto.lastName;    
  
      const queryRunner = this.connection.createQueryRunner();
  
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const updatePerson = await queryRunner.manager.save(person);

        await queryRunner.commitTransaction();
      } catch (err) {            
        Logger.error('error update client');
        Logger.error(err);
        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
  
      return person;
  
    }
  

    

}
