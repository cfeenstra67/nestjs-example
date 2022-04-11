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
import { JSONSchemaValidationPipe } from './json-schema-pipe';
import {
  CreateUserRequest2Schema,
  CreateUserRequest2,
  UserResponse2Schema,
  UserResponse2
} from './user2.dto';
import { UserService } from './user.service';

const CreateUserRequest2Pipe = new JSONSchemaValidationPipe<CreateUserRequest2>(CreateUserRequest2Schema);

@Controller()
export class UserController2 {
  constructor(private readonly userService: UserService) {}

  /**
   * Get an application user by ID
   */
  @Get('user2/:id')
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
