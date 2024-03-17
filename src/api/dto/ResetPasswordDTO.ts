import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { validationOptionsMsg } from '../../utils/GLOBALS';

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'New user\'s password',
  })
  @IsString()
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    validationOptionsMsg('The password must be between 8 and 50 characters long, include at least 1 digit and 1 letter'))
  @IsNotEmpty(validationOptionsMsg('Password can not be empty'))
    password: string;
}