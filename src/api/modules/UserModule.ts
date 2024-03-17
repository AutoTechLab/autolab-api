import { Module } from '@nestjs/common';
import { UserService } from '../services/UserService';
import { UserController } from '../controllers/UserController';
import { MongoModule } from './MongoModule';
import { RepositoryModule } from './RepositoryModule';
import { MapperModule } from './MapperModule';
import { UserByEmailPipe } from '../pipes/UserByEmailPipe';

@Module({
  providers: [UserService, UserByEmailPipe],
  controllers: [UserController],
  imports: [MongoModule, RepositoryModule, MapperModule],
  exports: [UserService],
})
export class UserModule {}