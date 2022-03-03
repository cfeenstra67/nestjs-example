import { createApp } from './factory';

async function bootstrap() {
  const app = await createApp({ swaggerPath: 'swagger' });
  await app.listen(3000);
}
bootstrap();
