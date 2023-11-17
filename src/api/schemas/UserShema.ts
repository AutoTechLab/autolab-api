import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Organization } from './OrganizationSchema';
import * as mongoose from 'mongoose';

export enum State {
  PENDING,
  APPROVED
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
    username: string;

  @Prop()
    email: string;

  @Prop()
    phone: string;

  @Prop()
    password: string;

  @Prop()
    firstname: string;

  @Prop()
    lastname: string;

  @Prop({
    isRequired: false,
  })
    middlename: string;

  @Prop()
    birthDate: Date;

  @Prop({
    type: String,
    enum: State,
    default: 'PENDING',
  })
    state: string;

  @Prop({
    default: null,
  })
    avatar: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
    organization: Organization;
}

export const UserSchema = SchemaFactory.createForClass(User);