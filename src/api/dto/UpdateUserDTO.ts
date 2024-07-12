import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsDate, IsOptional, IsString, Matches} from 'class-validator';
import { Type } from 'class-transformer';
import {ENG_REGEX, NUM_REGEX, validationOptionsMsg} from "../../utils/GLOBALS";

export class UpdateUserDTO {
  @ApiPropertyOptional({
    description: 'User`s username',
    minLength: 2,
    maxLength: 40,
  })
  @Matches(
    new RegExp('^[' + ENG_REGEX + NUM_REGEX + '_' + ']{2,40}$'),
    validationOptionsMsg('Username is not correct (a-zA-Z0-9_), or too short (min: 2), or too long (max: 40)'))
  @IsOptional()
  @IsString(validationOptionsMsg('Username should be a string'))
    username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString(validationOptionsMsg('Firstname should be a string'))
    firstname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString(validationOptionsMsg('Lastname should be a string'))
    lastname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString(validationOptionsMsg('Middle name should be a string'))
    middlename: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate(validationOptionsMsg('Birth date should be a date'))
    birthDate: Date;
}