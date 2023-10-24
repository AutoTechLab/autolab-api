import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { User } from '../schemas/UserShema';
import { UserMapper } from '../mappers/UserMapper';
import { AlreadyRegisteredException } from '../../utils/exceptions/AlreadyRegisteredException';
import { EmailService } from './EmailService';
import { EmailToken } from '../schemas/EmailTokenSchema';
import { HOUR } from '../../utils/Date';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor (
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(EmailToken.name)
    private emailTokenModel: Model<EmailToken>,
    private readonly userMapper: UserMapper,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register (body: CreateUserDTO) {
    const { password, ...securedUser } = body;

    const user = await this.userModel.findOne({
      $or: [
        { username: securedUser.username },
        { email: securedUser.email },
        { phone: securedUser.phone },
      ],
    });

    if (user) {
      const repeats = [];
      user.username === body.username ? repeats.push('username') : '';
      user.email === body.email ? repeats.push('email') : '';
      user.phone === body.phone ? repeats.push('phone') : '';

      throw new AlreadyRegisteredException(repeats);
    }

    const hashedPassword = await this.hashPassword(password);

    await this.userModel.create({
      ...securedUser,
      password: hashedPassword,
      state: 'PENDING',
    });

    const { token } = await this.createEmailToken(securedUser.email);

    const message = {
      to: securedUser.email,
      subject: 'Approve email',
      text: `посилання-на-їбейший-фронт/${token}`,
    };
    await this.emailService.sendMail(message);

    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          this.deleteEmailToken(token),
        ), HOUR
      );
    });
  }

  private createEmailToken (email: string) {
    return this.emailTokenModel.create({
      email,
      token: v4(),
    });
  }

  private deleteEmailToken (token: string) {
    return this.emailTokenModel.deleteOne({
      token,
    });
  }

  private async hashPassword (password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async validateUser (username: string, password: string) {
    const user  = await this.userModel.findOne({
      $or: [
        { username },
        { email: username },
        { phone: username },
      ],
    });
    if (!user) throw new UnauthorizedException('Username or password are wrong');

    const comparedPasswords = await bcrypt.compare(password, user.password);

    if (!comparedPasswords) throw new UnauthorizedException('Username or password are wrong');

    return this.userMapper.getUser(user);
  }

  async login (user) {
    if (user.state !== 'APPROVED') throw new UnauthorizedException('User is not approved');
    return this.getAccessToken(user.id);
  }

  private getAccessToken (userId: mongoose.Schema.Types.ObjectId) {
    const payload = { sub: userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async approve (token: string) {
    const emailToken = await this.emailTokenModel.findOne({
      token,
    });

    if (!emailToken) throw new NotFoundException('Such token is not found');

    const user = await this.userModel.findOneAndUpdate(
      { email: emailToken.email },
      { state: 'APPROVED' },
    );

    await this.deleteEmailToken(token);

    return this.getAccessToken(user.id);
  }

  async requestEmailVerification (email: string) {
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) throw new NotFoundException('User with such email is not found');

    const { token } = await this.createEmailToken(email);

    const message = {
      to: email,
      subject: 'Approve email',
      text: `посилання-на-їбейший-фронт/${token}`,
    };
    await this.emailService.sendMail(message);

    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          this.deleteEmailToken(token),
        ), HOUR
      );
    });
  }
}