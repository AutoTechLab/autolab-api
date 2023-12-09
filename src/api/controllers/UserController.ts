import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../services/UserService';
import { JwtAuthGuard } from '../../utils/guards/JWTAuthGuard';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OrganizationMapper } from '../mappers/OrganizationMapper';
import { OrganizationsResponse } from '../responses/OrganizationsResponse';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor (
    private readonly userService: UserService,
    private readonly organizationMapper: OrganizationMapper,
  ) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    type: OrganizationsResponse,
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
  ) {
    const organizations = await this.userService.getOrganizations(req.user.id);
    return this.organizationMapper.getOrganizations(organizations);
  }
}