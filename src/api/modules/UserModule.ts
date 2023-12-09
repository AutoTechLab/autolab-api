import { Module } from '@nestjs/common';
import { UserService } from '../services/UserService';
import { UserController } from '../controllers/UserController';
import { MongoModule } from './MongoModule';
import { RepositoryModule } from './RepositoryModule';
import { MapperModule } from './MapperModule';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [MongoModule, RepositoryModule, MapperModule],
  exports: [UserService],
})
export class UserModule {}