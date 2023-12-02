import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './UserSchema';
import * as mongoose from 'mongoose';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema()
export class Organization {
  @Prop()
    name: string;

  @Prop()
    address: string;

  @Prop()
    info: string;

  @Prop({
    default: null,
  })
    avatar: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    employees: User[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);