import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * ValidationPipe is a custom pipe that uses class-validator and class-transformer
 * to validate and transform incoming data before it reaches the route handlers.
 * 
 * Requirements addressed:
 * - Data Validation (Technical Specification/3.1 API Design)
 *   Ensures incoming data meets specified criteria
 * - Input Sanitization (Technical Specification/9.2 Data Security)
 *   Prevents malicious or incorrect data from entering the system
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  /**
   * Transforms and validates the incoming data based on the DTO (Data Transfer Object) class.
   * 
   * @param value - The incoming data to be validated and transformed
   * @param metadata - Metadata for the current parameter being processed
   * @returns Promise<any> - The validated and transformed data
   * @throws BadRequestException if validation fails
   */
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    // If no metatype is provided or it's a native JavaScript type, skip validation
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert plain JavaScript object to class instance
    const object = plainToClass(metatype, value);

    // Validate the object using class-validator
    const errors = await validate(object);

    // If there are validation errors, throw a BadRequestException with error details
    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    // Return the validated and transformed object
    return object;
  }

  /**
   * Checks if the given metatype should be validated.
   * 
   * @param metatype - The type to check for validation
   * @returns boolean - True if the type should be validated, false otherwise
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Formats validation errors into a more readable structure.
   * 
   * @param errors - Array of validation errors
   * @returns object - Formatted error object
   */
  private formatErrors(errors: any[]): object {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);
      return acc;
    }, {});
  }
}