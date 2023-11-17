import { Module } from '@nestjs/common';
import { AuthService } from '../services/AuthService';
import { AuthController } from '../controllers/AuthController';
import { MongoModule } from './MongoModule';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from '../../utils/access/LocalStrategy';
import { MapperModule } from './MapperModule';
import { JwtStrategy } from '../../utils/access/JWTStrategy';
import { EmailModule } from './EmailModule';


@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    MongoModule,
    PassportModule,
    MapperModule,
    EmailModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}