import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEntityException extends HttpException {
  constructor (entity) {
    super(`${entity} with such id is not found`, HttpStatus.BAD_REQUEST);
  }
}