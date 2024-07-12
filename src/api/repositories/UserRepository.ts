import { Injectable } from '@nestjs/common';
import mongoose, { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/UserSchema';

@Injectable()
export class UserRepository {
  constructor (
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  find (where: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(where)
  }

  findById (id: mongoose.Schema.Types.ObjectId): Promise<User> {
    return this.userModel.findById(id);
  }

  create (data): Promise<User> {
    return this.userModel.create(data) as Promise<User>;
  }

  updateById (id: mongoose.Schema.Types.ObjectId, data): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  update (where: FilterQuery<User>, data): Promise<User> {
    return this.userModel.findOneAndUpdate(where, data, { new: true });
  }

  async deleteRoles (rolesIds: string[]) {
    for (const roleId of rolesIds) {
      await this.userModel.updateOne({
        roles: roleId,
      }, {
        $pull: {
          roles: roleId,
        },
      });
    }
  }
}