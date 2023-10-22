import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../DTO/CreateUserDTO';
import { User } from '../schemas/UserShema';
import { UserMapper } from '../mappers/UserMapper';
import { AlreadyRegisteredException } from '../../utils/exceptions/AlreadyRegisteredException';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor (
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly userMapper: UserMapper,
    private readonly jwtService: JwtService,
  ) {}

  async register (body: CreateUserDTO) {
    const { password, ...securedUser } = body;

    const user = await this.userModel.findOne({
      $or: [
        { username: securedUser.username },
        { email: securedUser.username },
      ],
    });

    if (user) throw new AlreadyRegisteredException();

    const hashedPassword = await this.hashPassword(password);

    await this.userModel.create({
      ...securedUser,
      password: hashedPassword,
      state: 'PENDING',
    });
  }

  async hashPassword (password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async validateUser (username: string, password: string) {
    const user  = await this.userModel.findOne({
      $or: [
        { username },
        { email: username },
      ],
    });
    if (!user) throw new UnauthorizedException('Username or password are wrong');

    const comparedPasswords = await bcrypt.compare(password, user.password);

    if (!comparedPasswords) throw new UnauthorizedException('Username or password are wrong');

    return this.userMapper.getUser(user);
  }

  async login (user) {
    if (user.state !== 'APPROVED') throw new UnauthorizedException('User is not approved');
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}