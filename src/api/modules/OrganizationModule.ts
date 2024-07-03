import { Module } from '@nestjs/common';
import { OrganizationController } from '../controllers/OrganizationController';
import { OrganizationService } from '../services/OrganizationService';
import { MapperModule } from './MapperModule';
import { RepositoryModule } from './RepositoryModule';
import { OrganizationByIdPipe } from '../pipes/OrganizationByIdPipe';
import { UserModule } from './UserModule';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationByIdPipe],
  imports: [RepositoryModule, MapperModule, UserModule],
  exports: [OrganizationService],
})
export class OrganizationModule {}