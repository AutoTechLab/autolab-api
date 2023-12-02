import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/modules/AuthModule';
import * as process from 'process';
import { EmailModule } from './api/modules/EmailModule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrganizationModule } from './api/modules/OrganizationModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'utils', 'files', 'static'),
    }),
    MongooseModule.forRoot(process.env.MONGO),
    EmailModule,
    AuthModule,
    OrganizationModule,
  ],
})
export class AppModule {}
