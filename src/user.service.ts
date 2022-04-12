import { PrismaService } from './prisma.service';
import { UserResponse } from './user.dto';
import { Prisma, PrismaClient } from '@prisma/client';

const userResponseSelectFields = {
  id: true,
  email: true,
  name: true,
} as const;

export class UserService {

  constructor(private prisma: PrismaClient) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: userResponseSelectFields
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserResponse> {
    return this.prisma.user.create({
      data,
      select: userResponseSelectFields
    });
  }
}
