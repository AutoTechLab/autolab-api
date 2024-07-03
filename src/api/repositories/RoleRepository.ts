import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../schemas/RoleSchema';
import { Model } from 'mongoose';

@Injectable()
export class RoleRepository {
  constructor (
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  create (data): Promise<Role> {
    return this.roleModel.create(data) as Promise<Role>;
  }

  findMany (data): Promise<Role[]> {
    return this.roleModel.find(data).populate('user').populate('organization');
  }

  deleteMany (data) {
    return this.roleModel.deleteMany(data);
  }

  find (data): Promise<Role> {
    return this.roleModel.findOne(data);
  }
}