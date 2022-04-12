import { NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserController } from './user.controller';
import { UserService } from './user.service';

async function loadUserController(): Promise<UserController> {
  const prismaClient = new PrismaClient();
  const userService = new UserService(prismaClient);
  const userController = new UserController(userService);

  const deleteUsers = prismaClient.user.deleteMany();
  await prismaClient.$transaction([deleteUsers]);

  return userController;
}

describe('UserController', () => {

  describe('user resource', () => {
    it('should create a user', async () => {
      const userController = await loadUserController();
      const input = { email: 'abc', name: 'Cam', password: 'Blah' };
      const user = await userController.createUser(input);
      expect({ email: user.email, name: user.name })
        .toStrictEqual({ email: input.email, name: input.name });
    });

    it('should retrieve a user', async () => {
      const userController = await loadUserController();
      const userInput = { email: 'abc', name: 'Mr. Goodman', password: 'Blah' };
      const userOut = await userController.createUser(userInput);
      const user = await userController.getUserById(userOut.id);
      expect(user).toStrictEqual(userOut);
    });

    it('should 404 with no users', async () => {
      const userController = await loadUserController();
      const userId = 1324324;
      expect(async () => {
        await userController.getUserById(userId);
      }).rejects.toEqual(new NotFoundException());
    });
  });
});
