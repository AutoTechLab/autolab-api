import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from '../schemas/OrganizationSchema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class OrganizationRepository {
  constructor (
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,
  ) {}

  create (data) {
    return this.organizationModel.create(data);
  }

  find (data) {
    return this.organizationModel.findOne(data).exec();
  }

  findById (id: mongoose.Schema.Types.ObjectId) {
    return this.organizationModel.findById(id);
  }

  deleteById (id: mongoose.Schema.Types.ObjectId) {
    return this.organizationModel.findByIdAndDelete(id);
  }

  findMany (data) {
    return this.organizationModel.find(data);
  }
}