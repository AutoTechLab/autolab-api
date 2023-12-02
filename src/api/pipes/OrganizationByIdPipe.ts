import { PipeTransform, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { InvalidEntityException } from '../../utils/exceptions/InvalidEntityException';

@Injectable()
export class OrganizationByIdPipe implements PipeTransform<mongoose.Schema.Types.ObjectId, Promise<mongoose.Schema.Types.ObjectId>> {
  constructor (
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async transform (organizationId: mongoose.Schema.Types.ObjectId) {
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) throw new InvalidEntityException('Organization');

    return organizationId;
  }
}