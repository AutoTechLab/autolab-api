import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { OrganizationRepository } from '../repositories/OrganizationRepository';

@Injectable()
export class UserService {
  constructor (
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  getOrganizations (userId: mongoose.Schema.Types.ObjectId) {
    return this.organizationRepository.findMany({
      employees: userId,
    });
  }
}