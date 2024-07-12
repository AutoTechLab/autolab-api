import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from '../schemas/OrganizationSchema';
import mongoose, { FilterQuery, Model } from 'mongoose';

@Injectable()
export class OrganizationRepository {
  constructor (
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,
  ) {}

  create (data): Promise<Organization> {
    return this.organizationModel.create(data) as Promise<Organization>;
  }

  find (data): Promise<Organization> {
    return this.organizationModel.findOne(data).exec();
  }

  findById (id: mongoose.Schema.Types.ObjectId): Promise<Organization> {
    return this.organizationModel.findById(id);
  }

  deleteById (id: mongoose.Schema.Types.ObjectId): Promise<Organization> {
    return this.organizationModel.findByIdAndDelete(id);
  }

  findMany (data: FilterQuery<Organization>): Promise<Organization[]> {
    return this.organizationModel.find(data);
  }

  populate (arr, data): Promise<Organization[]> {
    return this.organizationModel.populate(arr, data)
  }
}