import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/AuthService';
import { CreateUserDTO } from '../DTO/CreateUserDTO';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginBody, LoginResponse } from '../responses/LoginResponse';
import { UserResponse } from '../responses/UserResponse';
import { LocalAuthGuard } from '../../utils/guards/LocalAuthGuard';
import { JwtAuthGuard } from '../../utils/guards/JWTAuthGuard';

@Controller('/auth')
export class AuthController {
  constructor (
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
  @UseGuards(LocalAuthGuard)
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

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException`,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  getMe (
    @Request() req,
  ) {
    return req.user;
  }
}