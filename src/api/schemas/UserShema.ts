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
    password: string;

  @Prop()
    firstname: string;

  @Prop()
    lastname: string;

  @Prop()
    middlename: string;

  @Prop()
    age: number;

  @Prop({
    type: String,
    enum: State,
  })
    state: string;

  @Prop()
    avatar: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
    organization: Organization;
}

export const UserSchema = SchemaFactory.createForClass(User);