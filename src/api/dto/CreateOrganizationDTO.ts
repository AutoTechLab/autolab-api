import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { validationOptionsMsg } from '../../utils/GLOBALS';

export class CreateOrganizationDTO {
  @ApiProperty({
    description: 'Organization\'s name',
    minLength: 2,
    maxLength: 40,
  })
  @MinLength(2, validationOptionsMsg('Name is too short (min 2)'))
  @MaxLength(40, validationOptionsMsg('Name is too long (max 40)'))
  @IsNotEmpty(validationOptionsMsg('Name can not be empty'))
  @IsString(validationOptionsMsg('Name should be a string'))
    name: string;

  @ApiProperty({
    description: 'Organization\'s address',
    minLength: 2,
    maxLength: 40,
  })
  @MinLength(5, validationOptionsMsg('Address is too short (min 2)'))
  @MaxLength(100, validationOptionsMsg('Address is too long (max 40)'))
  @IsNotEmpty(validationOptionsMsg('Address can not be empty'))
  @IsString(validationOptionsMsg('Address should be a string'))
    address: string;

  @ApiPropertyOptional({
    description: 'More information about organization',
    minLength: 5,
    maxLength: 200,
  })
  @MinLength(5, validationOptionsMsg('Info is too short (min 5)'))
  @MaxLength(200, validationOptionsMsg('Info is too long (max 200)'))
  @IsOptional()
    info?: string;
}