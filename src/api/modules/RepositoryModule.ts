import { Module } from '@nestjs/common';
import { RoleRepository } from '../repositories/RoleRepository';
import { MongoModule } from './MongoModule';
import { UserRepository } from '../repositories/UserRepository';
import { OrganizationRepository } from '../repositories/OrganizationRepository';

@Module({
  providers: [RoleRepository, UserRepository, OrganizationRepository],
  imports: [MongoModule],
  exports: [MongoModule, RoleRepository, UserRepository, OrganizationRepository],
})
export class RepositoryModule {}