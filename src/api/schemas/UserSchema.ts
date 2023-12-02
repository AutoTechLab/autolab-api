import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from './RoleSchema';

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
  })
    state: string;

  @Prop()
    avatar: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);