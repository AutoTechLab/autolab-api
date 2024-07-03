import { Injectable } from '@nestjs/common';
import { CreateOrganizationDTO } from '../dto/CreateOrganizationDTO';
import mongoose from 'mongoose';
import { RoleRepository } from '../repositories/RoleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { AlreadyExistException } from '../../utils/exceptions/AlreadyExistException';
import {UserService} from "./UserService";

const DEFAULT_AVATAR = 'https://autolab-fs.s3.eu-north-1.amazonaws.com/default/avatar-org.svg';

@Injectable()
export class OrganizationService {
  constructor (
    private readonly organizationRepository: OrganizationRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {
  }

  async create (userId: mongoose.Schema.Types.ObjectId, body: CreateOrganizationDTO) {
    const duplicate = await this.organizationRepository.find({ name: body.name });
    if (duplicate) throw new AlreadyExistException('Organization', 'name');

    const organization = await this.organizationRepository.create({
      ...body,
      avatar: DEFAULT_AVATAR,
      employees: userId,
    });

    const role = await this.roleRepository.create({
      user: userId,
      organization: organization.id,
      name: 'OWNER',
    });

    await this.userService.addRole(userId, role.id);

    return organization;
  }

  async delete (organizationId: mongoose.Schema.Types.ObjectId) {
    await this.organizationRepository.deleteById(organizationId);

    const roles = await this.roleRepository.findMany({
      organization: organizationId,
    });
    await this.roleRepository.deleteMany({
      organization: organizationId,
    });

    await this.userService.deleteRoles(roles);
  }

  async getById (organizationId: mongoose.Schema.Types.ObjectId) {
    return this.organizationRepository.findById(organizationId);
  }
}