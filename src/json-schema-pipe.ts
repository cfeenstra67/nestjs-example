import Ajv, { JSONSchemaType, ValidateFunction, DefinedError } from 'ajv';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';

const ajv = new Ajv()

@Injectable()
export class JSONSchemaValidationPipe<T> implements PipeTransform {

  validate: ValidateFunction<T>;

  constructor(private schema: JSONSchemaType<T>) {
    this.validate = ajv.compile<T>(schema);
  }

  transform(value: any, metadata: ArgumentMetadata): T {
    if (!this.validate(value)) {
      throw new BadRequestException({
        message: 'Input Validation Failed',
        errors: this.validate.errors?.map((error) => (error as DefinedError).message)
      });
    }
    return value;
  }
}
