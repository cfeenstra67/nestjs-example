import { Module, DynamicModule, Scope, Inject } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: UserController.UserService,
      useFactory: async (prisma: PrismaService) => {
        console.log('Recreating user service.');
        return new UserService(prisma);
      },
      inject: [PrismaService],
      scope: Scope.REQUEST
    }
  ]
})
export class UserModule {
  constructor(private readonly prismaService: PrismaService) {}
}
