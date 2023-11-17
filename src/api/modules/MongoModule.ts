import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/UserShema';
import { Organization, OrganizationSchema } from '../schemas/OrganizationSchema';
import { EmailToken, EmailTokenSchema } from '../schemas/EmailTokenSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
    MongooseModule.forFeature([{ name: EmailToken.name, schema: EmailTokenSchema }]),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}