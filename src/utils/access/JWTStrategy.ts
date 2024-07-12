import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserMapper } from '../../api/mappers/UserMapper';
import {UserRepository} from "../../api/repositories/UserRepository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    private readonly  configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {
    super({
      jwtFromRequest: JwtStrategy.ExtractJwtFromCookies,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  static ExtractJwtFromCookies (req) {
    return req.cookies.accessToken;
  }
  async validate (payload: any) {
    if (!payload) throw new UnauthorizedException();

    const user = await this.userRepository.findById(payload.sub);

    if (!user) throw new UnauthorizedException('User is not unauthorized');
    return this.userMapper.getAllUser(user);
  }
}