import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '../database/entities/address.entity';
import { PersonEntity } from '../database/entities/person.entity';
import { UserEntity } from '../database/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, PersonEntity, UserEntity])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
