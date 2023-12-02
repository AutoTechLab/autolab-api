import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/UserSchema';
import { Organization, OrganizationSchema } from '../schemas/OrganizationSchema';
import { EmailToken, EmailTokenSchema } from '../schemas/EmailTokenSchema';
import { Role, RoleSchema } from '../schemas/RoleSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
    MongooseModule.forFeature([{ name: EmailToken.name, schema: EmailTokenSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}