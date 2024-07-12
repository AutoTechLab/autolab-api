import { Body, Controller, Get, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/UserService';
import { JwtAuthGuard } from '../../utils/guards/JWTAuthGuard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiBody, ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrganizationMapper } from '../mappers/OrganizationMapper';
import { UsersOrganizationsResponse } from '../responses/UsersOrganizationsResponse';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { UserResponse } from '../responses/UserResponse';
import { UserMapper } from '../mappers/UserMapper';
import { FileInterceptor } from '@nestjs/platform-express';
import {  FileValidation } from '../pipes/FileValidation';

@ApiTags('User')
@Controller('/users')
export class UserController {
  constructor (
    private readonly userService: UserService,
    private readonly organizationMapper: OrganizationMapper,
    private readonly userMapper: UserMapper,
  ) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UsersOrganizationsResponse,
    description: 'All user\'s organizations',
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      User is not unauthorized`,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/organizations')
  async getOrganizations (
    @Req() req,
  ): Promise<UsersOrganizationsResponse> {
    const organizations = await this.userService.getOrganizations(req.user.id);
    return {
      organizations: this.organizationMapper.getOrganizations(organizations),
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserResponse,
    description: 'Update user',
  })
  @ApiBadRequestResponse({
    description: `\n
    BadRequestException:
      Username is not correct (a-zA-Z0-9_), or too short (min: 2), or too long (max: 40)
      Username should be a string
      Firstname should be a string
      Lastname should be a string
      Middle name should be a string
      Birth date should be a date`,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      User is not unauthorized`,
  })
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update (
    @Body() body: UpdateUserDTO,
    @Req() req,
  ) {
    const user = await this.userService.update(req.user, body);
    return this.userMapper.getUser(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    type: UserResponse,
    description: 'Update user',
  })
  @ApiBadRequestResponse({
    description: `\n
    InvalidExtensionException:
      File extension is wrong
    
    TooLargeSizeException:
      The file size exceeds 1MB`,
  })
  @ApiNotFoundResponse({
    description: `\n
    NotFoundException"
      File is not found`,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      User is not unauthorized`,
  })
  @Patch('/avatar')
  async changeAvatar (
    @Req() req,
    @UploadedFile(FileValidation) file: Express.Multer.File,
  ) {
    const user = await this.userService.changeAvatar(req.user.id, file);
    return this.userMapper.getUser(user);
  }
}