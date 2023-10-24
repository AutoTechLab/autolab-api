import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/modules/AuthModule';
import * as process from 'process';
import { EmailModule } from './api/modules/EmailModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO),
    EmailModule,
    AuthModule,
  ],
})
export class AppModule {}
