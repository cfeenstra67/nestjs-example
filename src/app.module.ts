import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PrismaService } from './prisma.service';
import { UserModule } from './user.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    UserModule,
    RouterModule.register([
      {
        path: 'v1',
        children: [
          {
            path: 'users',
            module: UserModule
          },
        ]
      }
    ])
  ],
  providers: [
    PrismaService,
  ]
})
export class AppModule {}
