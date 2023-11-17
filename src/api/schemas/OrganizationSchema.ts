import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './UserShema';
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

  @Prop()
    avatar: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    partOwner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
    employees: User[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);