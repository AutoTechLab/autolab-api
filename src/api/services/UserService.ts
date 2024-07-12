import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { AwsService } from './AwsService';
import { Role } from '../schemas/RoleSchema';
import { DEFAULT_AVATARS } from './AuthService';

@Injectable()
export class UserService {
  constructor (
    private readonly organizationRepository: OrganizationRepository,
    private readonly userRepository: UserRepository,
    private readonly awsService: AwsService,
  ) {}

  async getOrganizations (userId: mongoose.Schema.Types.ObjectId) {
    const organizations = await this.organizationRepository.findMany({
      employees: userId,
    });

    const organizationsIds = organizations.map((organization) => organization.id);

    return this.organizationRepository.populate(organizations,{
      path: 'employees',
      populate: {
        path: 'roles',
        match: {
          organization: {
            $in: organizationsIds,
          },
        },
      },
    });
  }

  async update ({ id, username }, data: UpdateUserDTO) {
    const isOtherUserExist = data.username === username
      ? false
      : !!(await this.get(data.username));
    if (isOtherUserExist) throw new BadRequestException('User with such username already exist')

    return this.userRepository.updateById(id, data);
  }

  get (username: string) {
    return this.userRepository.find({
      $or: [
        { username },
        { email: username },
        { phone: username },
      ],
    });
  }

  async changeAvatar (userId: mongoose.Schema.Types.ObjectId, file: Express.Multer.File) {
    const user = await this.userRepository.findById(userId);

    const path = user.avatar && this.awsService.getPathFromLink(user.avatar);
    const isDefaultAvatar = DEFAULT_AVATARS.some((avatar) => avatar === path);

    if (path && !isDefaultAvatar) {
      await this.awsService.deleteFile(path);
    }

    user.avatar = await this.awsService.uploadFile(file);

    await user.save();
    return user;
  }

  async addRole (userId: mongoose.Schema.Types.ObjectId, roleId: mongoose.Schema.Types.ObjectId) {
    return this.userRepository.updateById(userId, {
      $push: {
        roles: roleId,
      },
    });
  }

  async deleteRoles (roles: Role[]) {
    for (const role of roles) {
      await this.userRepository.update({
        roles: role.id,
      }, {
        $pull: {
          roles: role.id,
        },
      })
    }
  }
}