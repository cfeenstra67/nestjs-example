import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/factory';
import { PrismaService } from '../src/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    const deleteUsers = prisma.user.deleteMany();

    prisma.$transaction([deleteUsers]);
  });

  it('/user (POST)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ email: 'cam@google.com', name: 'cam', password: 'blah' })
      .expect(201);
  });

  it('/user (POST) without name', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ email: 'cam2@google.com', password: 'password' })
      .expect(201);
  });

  it('/user (POST) bad request', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ email: 'blah', name: 'cam' })
      .expect(400);
  });

  it('/user/:id (GET) 404', () => {
    return request(app.getHttpServer()).get('/user/123').expect(404);
  });

  it('/user/:id (GET)', async () => {
    const user = await prisma.user.create({ data: { email: 'abc', password: 'blah' } });
    return request(app.getHttpServer())
      .get('/user/' + user.id)
      .expect(200);
  });
});
