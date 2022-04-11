import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserController } from './user.controller';
import { UserController2 } from './user2.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController, UserController2],
  providers: [
    UserService,
    PrismaService,
  ]
})
export class AppModule {}
