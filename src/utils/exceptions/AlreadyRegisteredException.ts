import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyRegisteredException extends HttpException {
  constructor() {
    super('User with such username already exist', HttpStatus.BAD_REQUEST);
  }
}