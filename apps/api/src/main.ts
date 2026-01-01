import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ValidationPipe supprimé - nous utilisons Zod pour la validation
  // La validation se fera au niveau des contrôleurs avec des pipes Zod personnalisés
  
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on ${port}`);
}

bootstrap();
