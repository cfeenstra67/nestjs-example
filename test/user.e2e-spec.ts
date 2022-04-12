import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/factory';
import { PrismaService } from '../src/prisma.service';

interface Context {
  app: INestApplication;
  prisma: PrismaClient;
}

async function loadTestContext(): Promise<Context> {
  const prisma = new PrismaClient();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: PrismaService,
        useValue: prisma
      }
    ]
  }).compile();

  const app = moduleFixture.createNestApplication();
  setupApp(app);
  await app.init();

  const deleteUsers = prisma.user.deleteMany();

  prisma.$transaction([deleteUsers]);

  return { app, prisma };
}

describe('UserController (e2e)', () => {

  // NOTE: could have an afterAll() hook that does any necessary cleanup
  // from all tests

  it('/v1/users (POST)', async () => {
    const { app } = await loadTestContext();
    return request(app.getHttpServer())
      .post('/v1/users')
      .send({ email: 'cam@google.com', name: 'cam', password: 'blah' })
      .expect(201);
  });

  it('/v1/users (POST) without name', async () => {
    const { app } = await loadTestContext();
    return request(app.getHttpServer())
      .post('/v1/users')
      .send({ email: 'cam2@google.com', password: 'password' })
      .expect(201);
  });

  it('/v1/users (POST) bad request', async () => {
    const { app } = await loadTestContext();
    return request(app.getHttpServer())
      .post('/v1/users')
      .send({ email: 'blah', name: 'cam' })
      .expect(400);
  });

  it('/v1/users/:id (GET) 404', async () => {
    const { app } = await loadTestContext();
    return request(app.getHttpServer()).get('/v1/users/123').expect(404);
  });

  it('/v1/users/:id (GET)', async () => {
    const { app, prisma } = await loadTestContext();
    const user = await prisma.user.create({ data: { email: 'abc', password: 'blah' } });
    return request(app.getHttpServer())
      .get('/v1/users/' + user.id)
      .expect(200);
  });

});
