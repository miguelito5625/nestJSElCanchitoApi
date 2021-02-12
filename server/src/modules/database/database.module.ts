import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

// @Module({
//     imports: [TypeOrmModule.forRoot({
//         "type": "mysql",
//         "host": "35.202.164.49",
//         "port": 3306,
//         "username": "administrador",
//         "password": "Mariobross5625.",
//         "database": "elcanchito",
//         "entities": ["dist/**/*.entity{.ts,.js}"],
//         "synchronize": true
//       })]
// })

@Module({
    imports: [TypeOrmModule.forRoot()]
})

export class DatabaseModule {
    constructor(private connection: Connection) {}

}
