import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../database/entities/client.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity, ClientEntity])],
  controllers: [ClientsController],
  providers: [ClientsService]
})
export class ClientsModule {}
