import { Module } from '@nestjs/common';
import { UserMapper } from '../mappers/UserMapper';
import { OrganizationMapper } from '../mappers/OrganizationMapper';

@Module({
  providers: [UserMapper, OrganizationMapper],
  exports: [UserMapper, OrganizationMapper],
})
export class MapperModule {}