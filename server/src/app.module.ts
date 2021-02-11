import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DatabaseModule } from './modules/database/database.module';


@Module({
  imports: [DatabaseModule, UsersModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
