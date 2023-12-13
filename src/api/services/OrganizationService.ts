import { Injectable } from '@nestjs/common';
import { CreateOrganizationDTO } from '../dto/CreateOrganizationDTO';
import mongoose from 'mongoose';
import { RoleRepository } from '../repositories/RoleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { AlreadyExistException } from '../../utils/exceptions/AlreadyExistException';

@Injectable()
export class OrganizationService {
  constructor (
    private readonly organizationRepository: OrganizationRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
  ) {
  }

  async create (userId: mongoose.Schema.Types.ObjectId, body: CreateOrganizationDTO) {
    const duplicate = await this.organizationRepository.find({ name: body.name });
    if (duplicate) throw new AlreadyExistException('Organization', 'name');

    const organization = await this.organizationRepository.create({
      ...body,
      employees: userId,
    });

    const role = await this.roleRepository.create({
      user: userId,
      organization: organization.id,
      name: 'OWNER',
    });

    await this.userRepository.updateRoleById(userId, role.id);

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

    const rolesIds = roles.map((role) => role.id);
    await this.userRepository.deleteRoles(rolesIds);
  }

  async getById (organizationId: mongoose.Schema.Types.ObjectId) {
    return this.organizationRepository.findById(organizationId);
  }
}