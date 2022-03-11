import { IsEmail, IsOptional, IsString } from 'class-validator';
import { User } from '@prisma/client';

export class CreateUserRequest {
  /**
   * Email address for the new user. This must be unique.
   */
  @IsEmail()
  email: string;
  /**
   * Name for the new user.
   */
  @IsOptional()
  name?: string;
  /**
   * User password.
   */
  @IsString()
  password: string;
}

export class UserResponse implements Omit<User, 'password'> {
  /**
   * Unique identifier for the user.
   */
  id: number;
  /**
   * User email address.
   */
  email: string;
  /**
   * User name.
   */
  name: string | null;
}
