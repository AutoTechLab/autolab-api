import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ResetPasswordTokenDocument = HydratedDocument<ResetPasswordToken>;

@Schema()
export class ResetPasswordToken {
  @Prop()
  email: string;

  @Prop()
  token: string;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

export const ResetPasswordTokenSchema = SchemaFactory.createForClass(ResetPasswordToken);