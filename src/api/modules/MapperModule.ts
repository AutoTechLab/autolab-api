import { Module } from '@nestjs/common';
import { UserMapper } from '../mappers/UserMapper';

@Module({
  providers: [UserMapper],
  exports: [UserMapper],
})
export class MapperModule {}