import { typeGraphQLModule, graphQlResolvers } from './graphql';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    typeGraphQLModule()
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    ...graphQlResolvers
  ]
})
export class AppModule {}
