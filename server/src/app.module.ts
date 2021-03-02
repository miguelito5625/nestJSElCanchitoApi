import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DatabaseModule } from './modules/database/database.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { ProductsModule } from './modules/products/products.module';


@Module({
  imports: [DatabaseModule, UsersModule, ClientsModule, SuppliersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
