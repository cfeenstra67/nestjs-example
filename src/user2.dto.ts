import { JTDDataType } from 'ajv/dist/jtd';
import { JSONSchemaValidationPipe } from './json-schema-pipe';

// Example using JSON schema
export const CreateUserRequest2Schema = {
  type: 'object',
  description: 'Request to create a new user.',
  properties: {
    email: {
      type: 'string',
      description: 'Email address for the new user. This must be unique.'
    },
    name: {
      type: 'string',
      description: 'Name for the new user.'
    },
    password: {
      type: 'string',
      description: 'User password.'
    }
  },
  required: [
    'email',
    'password'
  ]
} as const;

export type CreateUserRequest2 = JTDDataType<typeof CreateUserRequest2Schema>

export const UserResponse2Schema = {
  type: 'object',
  description: 'Response to the create user endpoint.',
  properties: {
    id: {
      type: 'number',
      description: 'User ID.'
    },
    email: {
      type: 'string',
      description: 'User email.'
    },
    name: {
      type: 'string',
      description: 'User name.',
      nullable: true
    }
  },
  required: [
    'id',
    'email',
    'name'
  ],
  additionalProperties: false
} as const;

export type UserResponse2 = JTDDataType<typeof UserResponse2Schema>
