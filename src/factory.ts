import { ValidationPipe, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';

export interface AppConfig {
  swaggerPath?: string;
  nestOptions?: object;
}

export function createSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('Showing off a possible API stack')
    .setVersion('1.0')
    .build();

  return SwaggerModule.createDocument(app, config);
}

export function setupApp(app: INestApplication, config?: AppConfig): void {
  app.useGlobalPipes(new ValidationPipe());

  if (config?.swaggerPath) {
    const doc = createSwaggerDocument(app);
    SwaggerModule.setup(config.swaggerPath, app, doc);
  }
}

export async function createApp(config?: AppConfig): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, config?.nestOptions);
  setupApp(app, config);
  return app;
}
