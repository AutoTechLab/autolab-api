import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../utils/guards/JWTAuthGuard';
import { CreateOrganizationDTO } from '../dto/CreateOrganizationDTO';
import { OrganizationService } from '../services/OrganizationService';
import { SimpleOrganizationResponse } from '../responses/SimpleOrganizationResponse';
import mongoose from 'mongoose';
import { OrganizationByIdPipe } from '../pipes/OrganizationByIdPipe';
import { OwnerGuard } from '../../utils/guards/OwnerGuard';
import { OrganizationMapper } from '../mappers/OrganizationMapper';
import { OrganizationResponse } from '../responses/OrganizationsResponse';

@ApiTags('Organizations')
@Controller('/organization')
export class OrganizationController {
  constructor (
    private readonly organizationService: OrganizationService,
    private readonly organizationMapper: OrganizationMapper,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: SimpleOrganizationResponse,
    status: 201,
  })
  @ApiBadRequestResponse({
    description: `\n
    InvalidBodyException:
      Name is too short (min 2)
      Name is too long (max 40)
      Name can not be empty
      Name should be a string
      Address is too short (min 2)
      Address is too long (max 40)
      Address can not be empty
      Address should be a string
      Info is too short (min 5)
      Info is too long (max 200)
      
    AlreadyExistException:
      Organization with such name already exist`,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      User is not unauthorized`,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create (
    @Req() req,
    @Body() body: CreateOrganizationDTO,
  ) {
    const { id } = await this.organizationService.create(req.user.id, body);
    return { id };
  }

  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: `\n
    InvalidEntityException:
      Organization with such id is not found`,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      User is not unauthorized`,
  })
  @ApiForbiddenResponse({
    description: `\n
    NoPermissionException:
      You have not permission to perform this action`,
  })
  @ApiParam({
    name: 'organizationId',
    type: String,
  })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete('/:organizationId')
  delete (
    @Param('organizationId', OrganizationByIdPipe) organizationId: mongoose.Schema.Types.ObjectId,
  ) {
    return this.organizationService.delete(organizationId);
  }

  @ApiBearerAuth()
  @Get('/:organizationId')
  @ApiOkResponse({
    type: OrganizationResponse,
  })
  @ApiBadRequestResponse({
    description: `\n
    InvalidEntityException:
      Organization with such id is not found`,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      User is not unauthorized`,
  })
  @ApiParam({
    name: 'organizationId',
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  async getById (
    @Param('organizationId', OrganizationByIdPipe) organizationId: mongoose.Schema.Types.ObjectId,
  ) {
    const organization = await this.organizationService.getById(organizationId);
    return this.organizationMapper.getOrganization(organization);
  }
}