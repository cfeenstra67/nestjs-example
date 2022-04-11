import exclude from './exclude';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { JSONSchemaValidationPipe } from './json-schema-pipe';
import {
  CreateUserRequest2Schema,
  CreateUserRequest2,
  UserResponse2Schema,
  UserResponse2
} from './user2.dto';
import { UserService } from './user.service';

const CreateUserRequest2Pipe = new JSONSchemaValidationPipe<CreateUserRequest2>(CreateUserRequest2Schema);

declare type Mutable<T extends object> = {
    -readonly [K in keyof T]: T[K]
}

@Controller()
export class UserController2 {
  constructor(private readonly userService: UserService) {}

  /**
   * Get an application user by ID
   */
  @Get('user2/:id')
  @ApiResponse({
    status: 200,
    // TS complains about readonly types, hack for now
    schema: UserResponse2Schema as any
  })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponse2> {
    const user = await this.userService.user({ id });
    if (user === null) {
      throw new NotFoundException();
    }
    return exclude(user, 'password');
  }

  /**
   * Create a new user.
   */
  @Post('/user2')
  // TS complains about the immutable properties on the schema because
  // of the declaration of `as const` (which is required for the JTD Data
  // Type Generation)
  @ApiBody({ schema: CreateUserRequest2Schema as any })
  @ApiResponse({
    status: 201,
    // TS complains about readonly types, hack for now
    schema: {
      name: 'CreateUserRequest2',
      ...CreateUserRequest2Schema
    } as any,
  })
  async createUser(
    @Body(CreateUserRequest2Pipe) postData: CreateUserRequest2
  ): Promise<UserResponse2> {
    const existingUser = await this.userService.user({ email: postData.email });
    if (existingUser !== null) {
      throw new ConflictException(
        `User with email ${postData.email} already exists.`
      );
    }
    const user = await this.userService.createUser(postData)
    return exclude(user, 'password');
  }
}
