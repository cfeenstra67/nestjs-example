import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
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
    return user;
  }

  /**
   * Create a new user.
   */
  @Post('/user')
  async createUser(@Body() postData: CreateUserRequest): Promise<UserResponse> {
    return this.userService.createUser(postData);
  }
}
