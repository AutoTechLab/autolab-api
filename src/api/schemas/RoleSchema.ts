import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Organization } from './OrganizationSchema';
import * as mongoose from 'mongoose';
import { User } from './UserSchema';

export type RoleDocument = HydratedDocument<Role>;

export enum Roles {
  'OWNER',
  'PART_OWNER',
  'EMPLOYEE',
}

@Schema()
export class Role {
  @Prop({
    enum: Roles,
  })
    name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
    organization: Organization;
}

export const RoleSchema = SchemaFactory.createForClass(Role);