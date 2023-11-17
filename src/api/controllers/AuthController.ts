import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/AuthService';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam, ApiQuery, ApiResponse,
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

  @ApiResponse({})
  @ApiBadRequestResponse({
    description: `\n
    InvalidBodyException:
      Username is not correct (a-zA-Z0-9_), or too short (min: 2), or too long (max: 40)
      Username can not be empty
      Username should be a string
      Email is can not be empty
      The phone number can not be empty
      The password must be between 8 and 50 characters long, include at least 1 digit and 1 letter
      Password can not be empty
      Password should be a string
      Firstname is too short (min 2)
      Firstname is too long (max 40)
      Firstname can not be empty
      Firstname should be a string
      Lastname is too short (min 2)
      Lastname is too long (max 40)
      Lastname can not be empty
      Lastname should be a string
      Middle name is too short (min 2)
      Middle name is too long (max 40)
      Middle name should be a string
      Birth date can not be empty
      Birth date should be a date
    
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
  @ApiResponse({
    type: LoginResponse,
    status: 201,
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