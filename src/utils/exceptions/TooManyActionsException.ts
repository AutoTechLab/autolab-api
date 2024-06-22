import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyActionsException extends HttpException {
  constructor () {
    super('Too many action. Try again in 1 minute', HttpStatus.BAD_REQUEST);
  }
}