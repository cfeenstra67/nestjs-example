import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
  ConflictException,
  Inject
} from '@nestjs/common';
import { CreateUserRequest, UserResponse } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {

  // Can be any unique string or Symbol, though if it isn't provided it will
  // show up in the error message so good to use a value that's descriptive
  static UserService = 'UserController.UserService';

  constructor(
    @Inject(UserController.UserService) private userService: UserService
  ) {}

  /**
   * Get an application user by ID
   */
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponse> {
    const user = await this.userService.getUser({ id });
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }

  /**
   * Create a new user.
   */
  @Post()
  async createUser(@Body() postData: CreateUserRequest): Promise<UserResponse> {
    const existingUser = await this.userService.getUser({ email: postData.email });
    if (existingUser !== null) {
      throw new ConflictException(
        `User with email ${postData.email} already exists.`
      );
    }
    return await this.userService.createUser(postData)
  }
}
