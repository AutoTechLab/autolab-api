import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/AuthService';
import { CreateUserDTO } from '../DTO/CreateUserDTO';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginBody, LoginResponse } from '../responses/LoginResponse';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOkResponse({
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      Username or password are wrong
      User is not approved`,
  })
  @ApiBody({
    type: LoginBody,
  })
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login (
    @Request() req,
  ) {
    return this.authService.login(req.user);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: `\n
    AlreadyRegisteredException:
      User with such username already exist`,
  })
  @Post('/register')
  register (
    @Body() body: CreateUserDTO,
  ) {
    return this.authService.register(body);
  }
}