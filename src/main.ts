import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "process";
import {ValidationPipe} from "@nestjs/common";

async function start() {
  const PORT = process.env.PORT || 3333
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes( new ValidationPipe())
  app.enableCors()
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  });
}
start();
