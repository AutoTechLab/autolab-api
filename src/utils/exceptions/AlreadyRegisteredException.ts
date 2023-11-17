import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyRegisteredException extends HttpException {
  constructor (repeats: string[]) {
    super(`User with such ${repeats.join(' and ')} already exist`, HttpStatus.BAD_REQUEST);
  }
}