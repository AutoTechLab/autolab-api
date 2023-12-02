import { Injectable } from '@nestjs/common';
import { Schema, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/UserSchema';

@Injectable()
export class UserRepository {
  constructor (
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  updateRoleById (userId: Schema.Types.ObjectId, roleId: Schema.Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(userId, {
      $push: {
        roles: roleId,
      },
    });
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