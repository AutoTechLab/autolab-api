import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EmailTokenDocument = HydratedDocument<EmailToken>;

@Schema()
export class EmailToken {
  @Prop()
    email: string;

  @Prop()
    token: string;

  @Prop({
    default: Date.now,
  })
    createdAt: Date;
}

export const EmailTokenSchema = SchemaFactory.createForClass(EmailToken);