import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserMapper } from '../mappers/UserMapper';
import { AlreadyRegisteredException } from '../../utils/exceptions/AlreadyRegisteredException';
import { EmailService } from './EmailService';
import { EmailToken } from '../schemas/EmailTokenSchema';
import {HOUR, MINUTE} from '../../utils/Date';
import { v4 } from 'uuid';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as process from 'process';
import { UserRepository } from '../repositories/UserRepository';
import { ResetPasswordToken } from '../schemas/ResetPasswordTokenSchema';
import { TooManyActionsException } from '../../utils/exceptions/TooManyActionsException';
import { ResetPasswordDTO } from '../dto/ResetPasswordDTO';
import { ChangePasswordDTO } from '../dto/ChangePasswordDTO';

@Injectable()
export class AuthService {
  constructor (
    @InjectModel(EmailToken.name)
    private emailTokenModel: Model<EmailToken>,
    @InjectModel(ResetPasswordToken.name)
    private resetPasswordTokenModel: Model<ResetPasswordToken>,
    private readonly userMapper: UserMapper,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
  ) {}

  async register (body: CreateUserDTO) {
    const { password, ...securedUser } = body;

    const userByUsername = await this.userRepository.find({
      username: securedUser.username,
    });

    const userByEmail = await this.userRepository.find({
      email: securedUser.email,
    });

    const userByPhone = await this.userRepository.find({
      phone: securedUser.phone,
    });

    const repeats = [];
    userByUsername ? repeats.push('username') : '';
    userByEmail ? repeats.push('email') : '';
    userByPhone ? repeats.push('phone') : '';
    if (repeats.length) throw new AlreadyRegisteredException(repeats);


    const avatar = join(process.env.BASE_URL, 'avatars', 'standard.png');
    const hashedPassword = await this.hashPassword(password);

    await this.userRepository.create({
      ...securedUser,
      avatar,
      password: hashedPassword,
      state: 'PENDING',
    });

    await this.requestEmailVerification(securedUser.email);
  }

  private async hashPassword (password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async validateUser (username: string, password: string) {
    const user  = await this.userRepository.find({
      $or: [
        { username },
        { email: username },
        { phone: username },
      ],
    });
    if (!user) throw new UnauthorizedException('Username is wrong');

    const comparedPasswords = await bcrypt.compare(password, user.password);

    if (!comparedPasswords) throw new UnauthorizedException('Password is wrong');

    return this.userMapper.getAllUser(user);
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

    const user = await this.userRepository.update(
      { email: emailToken.email },
      { state: 'APPROVED' },
    );

    await this.deleteToken(token, this.emailTokenModel);

    return this.getAccessToken(user.id);
  }

  async requestEmailVerification (email: string) {
    const subject = 'Approve email';
    const path = process.env.FRONT_BASE_URL + 'register/confirm/';

    await this.requestEmail(email, subject, path, this.emailTokenModel);
  }

  async requestEmailToResetPassword (email: string) {
    const subject = 'Reset password';
    const path = process.env.FRONT_BASE_URL + 'login/recover/';

    await this.requestEmail(email, subject, path, this.resetPasswordTokenModel);
  }

  private async requestEmail (email: string, subject: string, path: string, model: Model<EmailToken> | Model<ResetPasswordToken>) {
    await this.checkTooManyActions(email, model);
    const { token } = await this.createToken(email, model);

    const message = {
      to: email,
      subject,
      text: `${path}${token}`,
    };
    await this.emailService.sendMail(message);

    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          this.deleteToken(token, model),
        ), HOUR
      );
    });
  }

  private createToken (email: string, model: Model<EmailToken> | Model<ResetPasswordToken>) {
    return model.create({
      email,
      token: v4(),
    });
  }

  private async checkTooManyActions (email: string, model: Model<EmailToken> | Model<ResetPasswordToken>) {
    const token = await model.findOne({ email });

    if (!token) return;
    if (Date.now() - token.createdAt.getTime() < MINUTE) throw new TooManyActionsException();
    await model.deleteOne({ email });
  }

  private deleteToken (token: string, model: Model<EmailToken> | Model<ResetPasswordToken>) {
    return model.deleteOne({
      token,
    });
  }

  async resetPassword (token: string, { password }: ResetPasswordDTO) {
    const emailToken = await this.resetPasswordTokenModel.findOne({
      token,
    });

    if (!emailToken) throw new NotFoundException('Such token is not found');

    const user = await this.userRepository.find({
      email: emailToken.email,
    });

    const comperedPasswords = await bcrypt.compare(password, user.password);
    if (comperedPasswords) throw new BadRequestException('New password must be different from the old one');

    user.password = await this.hashPassword(password);
    await user.save();

    return this.getAccessToken(user.id);
  }

  async changePassword (userId: mongoose.Schema.Types.ObjectId, { oldPassword, newPassword } : ChangePasswordDTO) {
    if (oldPassword === newPassword) throw new BadRequestException('New password must be different from the old one');

    const user = await this.userRepository.findById(userId);

    const comperedPasswords = await bcrypt.compare(oldPassword, user.password);
    if (!comperedPasswords) throw new BadRequestException('Password is wrong');

    user.password = await this.hashPassword(newPassword);
    await user.save();
  }
}