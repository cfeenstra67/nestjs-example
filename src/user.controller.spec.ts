import { NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    const app = testingModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userController = testingModule.get<UserController>(UserController);
    prismaService = testingModule.get<PrismaService>(PrismaService);

    const deleteUsers = prismaService.user.deleteMany();

    await prismaService.$transaction([deleteUsers]);
  });

  describe('user resource', () => {
    it('should create a user', async () => {
      const input = { email: 'abc', name: 'Cam', password: 'Blah' };
      const user = await userController.createUser(input);
      expect({ email: user.email, name: user.name })
        .toStrictEqual({ email: input.email, name: input.name });
    });

    it('should retrieve a user', async () => {
      const userInput = { email: 'abc', name: 'Mr. Goodman', password: 'Blah' };
      const userOut = await userController.createUser(userInput);
      const user = await userController.getUserById(userOut.id);
      expect(user).toStrictEqual(userOut);
    });

    it('should 404 with no users', async () => {
      const userId = 1324324;
      expect(async () => {
        await userController.getUserById(userId);
      }).rejects.toEqual(new NotFoundException());
    });
  });
});
