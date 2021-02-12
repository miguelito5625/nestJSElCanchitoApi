import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AddressEntity } from '../database/entities/address.entity';
import { ClientEntity } from '../database/entities/client.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { CreateClientDto } from './create-client.dto';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @InjectRepository(PersonEntity)
    private personRepository: Repository<PersonEntity>,
    @InjectRepository(ClientEntity)
    private clientsRepository: Repository<ClientEntity>,
    private connection: Connection
  ) {

  }

  async createOne(createClientDto: CreateClientDto) {

    const personEntity = new PersonEntity();
    personEntity.generate(createClientDto);
    const addressEntity = new AddressEntity();
    addressEntity.generate(createClientDto);
    let clientEntity = new ClientEntity();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const address = await queryRunner.manager.save(addressEntity);
      personEntity.address = address;
      const person = await queryRunner.manager.save(personEntity);
      clientEntity.person = person;
      clientEntity = await queryRunner.manager.save(clientEntity);
      await queryRunner.commitTransaction();
    } catch (err) {
      Logger.error('error on create client');
      Logger.error(err);
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      return null;
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
    return await this.clientsRepository.find({ relations: ["person", "person.address"] });
  }

  async findOne(id: number): Promise<ClientEntity> {
    return await this.clientsRepository.findOne({
      where: { id },
      relations: ['person', 'person.address'],
    });
  }


  async update(createClientDto: CreateClientDto): Promise<ClientEntity> {
    const client = await this.clientsRepository.findOne({
      where: { id: createClientDto.id },
      relations: ['person', 'person.address'],
    });

    if (!client) {
      return null;
    }

    const person = client.person;
    const address = person.address;
    address.generate(createClientDto);
    person.generate(createClientDto);

    // client.firstName = createClientDto.firstName;
    // client.lastName = createClientDto.lastName;    

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateAddress = await queryRunner.manager.save(address);
      person.address = updateAddress;
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


  async switchActive(clientId: number): Promise<ClientEntity> {

    const client = await this.clientsRepository.findOne({
      where: { id: clientId },
      relations: ['person', 'person.address'],
    });

    if (!client) {
      return null;
    }

    const person = await this.personRepository.findOne({
      where: { id: client.person.id },
      relations: ['address'],
    });
    person.isActive = !person.isActive;
    
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updatePerson = await queryRunner.manager.save(person);
      client.person = updatePerson;

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




}
