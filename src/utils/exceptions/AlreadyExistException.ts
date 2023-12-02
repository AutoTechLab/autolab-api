import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistException extends HttpException {
  constructor (entity, field) {
    super(`${entity} with such ${field} already exist`, HttpStatus.BAD_REQUEST);
  }
}