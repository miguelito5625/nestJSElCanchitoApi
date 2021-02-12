import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import { AppModule } from './app.module';
// import * as functions from 'firebase-functions';
// import * as express from 'express';

// const server = express();

// export const createNestServer = async (expressInstance) => {
//   const app = await NestFactory.create(
//     AppModule,
//     new ExpressAdapter(expressInstance),
//   );
//   app.enableCors();
//   return app.init();
// }


// createNestServer(server).
//   then(v => console.log('Nest Ready')).
//   catch(err => console.error('Nest broken', err));

// export const elCanchitoApi = functions.https.onRequest(server);