import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';


// definimos la ruta
const crPath = '/etc/letsencrypt/live/elcanchito.tk/fullchain.pem';
const pkPath = '/etc/letsencrypt/live/elcanchito.tk/privkey.pem';
const options: any = {};
//hola 5625
// validamos si los archivos existen
if (fs.existsSync(crPath) && fs.existsSync(pkPath)) {
  // cargamos los archivos sobre las options
  options.httpsOptions = {
    cert: fs.readFileSync(crPath),
    key: fs.readFileSync(pkPath)
  }
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule, options);
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


//   // export const elCanchitoApi = functions.runWith({memory: "512MB"}).https.onRequest(server);
//   export const elCanchitoApi = functions.https.onRequest(server);
