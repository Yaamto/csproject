import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Spécifiez le répertoire contenant vos images
    const uploadDirectory = path.resolve(__dirname, '..', 'uploads');
    
    // Définissez le chemin de l'URL pour accéder aux images
    const staticImagePath = '/uploads';
  
    // Définissez le gestionnaire de fichiers statiques
    app.use(staticImagePath, express.static(uploadDirectory));
  await app.listen(3000);
}
bootstrap();
