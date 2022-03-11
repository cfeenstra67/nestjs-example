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
import { CreateUserRequest, UserResponse } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get an application user by ID
   */
  @Get('user/:id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponse> {
    const user = await this.userService.user({ id });
    if (user === null) {
      throw new NotFoundException();
    }
    return exclude(user, 'password');
  }

  /**
   * Create a new user.
   */
  @Post('/user')
  async createUser(@Body() postData: CreateUserRequest): Promise<UserResponse> {
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
