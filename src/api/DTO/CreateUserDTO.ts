import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches, Max,
  MaxLength, Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ENG_REGEX, NUM_REGEX, validationOptionsMsg } from '../../utils/GLOBALS';

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
  @IsString()
    username: string;

  @ApiProperty({
    description: 'User`s email',
  })
  @IsNotEmpty(validationOptionsMsg('Email is can not be empty'))
  @IsString()
  @IsEmail()
    email: string;

  @ApiProperty({
    description: 'User`s password',
  })
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    validationOptionsMsg('The password must be between 8 and 50 characters long, include at least 1 digit and 1 letter'))
  @IsNotEmpty(validationOptionsMsg('Password can not be empty'))
  @IsString()
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
  @IsString()
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
  @IsString()
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
  @IsString()
    middlename?: string;

  @ApiProperty({
    description: 'User`s age',
    minimum: 18,
    maximum: 100,
  })
  @IsNotEmpty(validationOptionsMsg('Age can not be empty'))
  @IsInt()
  @Min(
    18,
    validationOptionsMsg('Min age is 18'))
  @Max(100,
    validationOptionsMsg('Max age is 100'))
    age: number;
}