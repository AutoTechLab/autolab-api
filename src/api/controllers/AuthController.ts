import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/AuthService';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam, ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginBody, LoginResponse } from '../responses/LoginResponse';
import { UserResponse } from '../responses/UserResponse';
import { LocalAuthGuard } from '../../utils/guards/LocalAuthGuard';
import { JwtAuthGuard } from '../../utils/guards/JWTAuthGuard';

@ApiTags('Auth')
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
      User with such username/email/phone already exist`,
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

  @Post('/approve/:token')
  @ApiOkResponse({
    type: LoginResponse,
  })
  @ApiNotFoundResponse({
    description: `\n
    NotFoundException: 
      Such token is not found`,
  })
  @ApiParam({
    name: 'token',
    required: true,
    description: 'Email token',
  })
  approve (
    @Param('token') token: string,
  ) {
    return this.authService.approve(token);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse({
    description: `\n
    NotFoundException: 
      User with such email is not found`,
  })
  @ApiQuery({
    name: 'email',
    description: 'User`s email',
  })
  @Post('/repeat/email')
  requestEmailVerification (
    @Query('email') email: string,
  ) {
    return this.authService.requestEmailVerification(email);
  }
}