import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../api/schemas/UserShema';
import { Model } from 'mongoose';
import { UserMapper } from '../../api/mappers/UserMapper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private  configService: ConfigService,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private userMapper: UserMapper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload) throw new UnauthorizedException();

    const user = await this.userModel.findById(payload.sub);

    if (!user) throw new UnauthorizedException();
    return this.userMapper.getUser(user);
  }
}