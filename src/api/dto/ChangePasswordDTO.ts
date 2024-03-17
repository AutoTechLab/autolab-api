import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { validationOptionsMsg } from '../../utils/GLOBALS';

export class ChangePasswordDTO {
  @ApiProperty({
    description: 'User\'s old password',
  })
  @IsString()
  @IsNotEmpty(validationOptionsMsg('User\'s old password can not be empty'))
    oldPassword: string;

  @ApiProperty({
    description: 'User\'s new password',
  })
  @IsString()
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    validationOptionsMsg('The password must be between 8 and 50 characters long, include at least 1 digit and 1 letter'))
  @IsNotEmpty(validationOptionsMsg('User\'s new password can not be empty'))
    newPassword: string;
}