// This must be imported before any GraphQL-related imports
import "reflect-metadata";

import { resolvers } from '@generated/type-graphql';
import { ApolloDriver } from "@nestjs/apollo";
import { Module } from '@nestjs/common';
import * as path from 'path';
import { PrismaService } from './prisma.service';
import { TypeGraphQLModule } from "@glcap-forks/typegraphql-nestjs";

@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
class GraphQlContextModule {}

export function typeGraphQLModule() {
  return TypeGraphQLModule.forRootAsync({
    imports: [GraphQlContextModule],
    inject: [PrismaService],
    driver: ApolloDriver,
    useFactory: (prisma: PrismaService) => ({
      path: "graphql",
      emitSchemaFile: path.resolve(__dirname, "..", "schema.gql"),
      context: () => ({ prisma }),
      playground: true,
      validate: true
    })
  });
}

export const graphQlResolvers: any[] = resolvers as any[];
