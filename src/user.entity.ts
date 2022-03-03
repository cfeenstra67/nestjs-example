import { IsEmail, IsOptional } from 'class-validator';
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
}

export class UserResponse implements User {
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
