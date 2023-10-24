import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional, IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ENG_REGEX, NUM_REGEX, validationOptionsMsg } from '../../utils/GLOBALS';
import { Type } from 'class-transformer';

export class CreateUserDTO {
  @ApiProperty({
    description: 'User`s username',
    minLength: 2,
    maxLength: 40,
  })
  @Matches(
    new RegExp('^[' + ENG_REGEX + NUM_REGEX + '_' + ']{2,40}$'),
    validationOptionsMsg('Username is not correct (a-zA-Z0-9_), or too short (min: 2), or too long (max: 40)'))
  @IsNotEmpty(validationOptionsMsg('Username can not be empty'))
  @IsString(validationOptionsMsg('Username should be a string'))
    username: string;

  @ApiProperty({
    description: 'User`s email',
  })
  @IsNotEmpty(validationOptionsMsg('Email is can not be empty'))
  @IsString()
  @IsEmail()
    email: string;

  @ApiProperty({
    description: 'User`s phone number',
  })
  @IsNotEmpty(validationOptionsMsg('The phone number can not be empty'))
  @IsPhoneNumber()
    phone: string;

  @ApiProperty({
    description: 'User`s password',
  })
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    validationOptionsMsg('The password must be between 8 and 50 characters long, include at least 1 digit and 1 letter'))
  @IsNotEmpty(validationOptionsMsg('Password can not be empty'))
  @IsString(validationOptionsMsg('Password should be a string'))
    password: string;

  @ApiProperty({
    description: 'User`s firstname',
    minLength: 2,
    maxLength: 40,
  })
  @MinLength(
    2,
    validationOptionsMsg('Firstname is too short (min 2)')
  )
  @MaxLength(
    40,
    validationOptionsMsg('Firstname is too long (max 40)'))
  @IsNotEmpty(validationOptionsMsg('Firstname can not be empty'))
  @IsString(validationOptionsMsg('Firstname should be a string'))
    firstname: string;

  @ApiProperty({
    description: 'User`s lastname',
    minLength: 2,
    maxLength: 40,
  })
  @MinLength(
    2,
    validationOptionsMsg('Lastname is too short (min 2)')
  )
  @MaxLength(
    40,
    validationOptionsMsg('Lastname is too long (max 40)'))
  @IsNotEmpty(validationOptionsMsg('Lastname can not be empty'))
  @IsString(validationOptionsMsg('Lastname should be a string'))
    lastname: string;

  @ApiPropertyOptional({
    description: 'User`s middle name',
    minLength: 2,
    maxLength: 40,
  })
  @MinLength(
    2,
    validationOptionsMsg('Middle name is too short (min 2)')
  )
  @MaxLength(
    40,
    validationOptionsMsg('Middle name is too long (max 40)'))
  @IsOptional()
  @IsString(validationOptionsMsg('Middle name should be a string'))
    middlename?: string;

  @ApiProperty({
    description: 'User`s age',
    minimum: 18,
    maximum: 100,
  })
  @IsNotEmpty(validationOptionsMsg('Age can not be empty'))
  @Type(() => Date)
  @IsDate(validationOptionsMsg('Birth date should be a date'))
    birthDate: Date;
}