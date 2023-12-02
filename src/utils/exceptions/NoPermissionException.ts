import { HttpException, HttpStatus } from '@nestjs/common';

export class NoPermissionException extends HttpException {
  constructor () {
    super('You have not permission to perform this action', HttpStatus.FORBIDDEN);
  }
}