import { Injectable } from '@nestjs/common';
import { Schema, Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/UserSchema';
import mongoose from "mongoose";

@Injectable()
export class UserRepository {
  constructor (
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  find (where: FilterQuery<User>) {
    return this.userModel.findOne(where)
  }

  findById (id: mongoose.Schema.Types.ObjectId) {
    return this.userModel.findById(id);
  }

  create (data) {
    return this.userModel.create(data);
  }

  update (where: FilterQuery<User>, data) {
    return this.userModel.findOneAndUpdate(where, data);
  }

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