import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    description: 'User`s username'
  })
  @IsNotEmpty()
  @IsString()
    username: string;

  @ApiProperty({
    description: 'User`s email'
  })
  @IsNotEmpty()
  @IsString()
    email: string;

  @ApiProperty({
    description: 'User`s password'
  })
  @IsNotEmpty()
  @IsString()
    password: string;

  @ApiProperty({
    description: 'User`s firstname'
  })
  @IsNotEmpty()
  @IsString()
    firstname: string;

  @ApiProperty({
    description: 'User`s lastname'
  })
  @IsNotEmpty()
  @IsString()
    lastname: string;

  @ApiProperty({
    description: 'User`s middle name'
  })
  @IsNotEmpty()
  @IsString()
    middlename: string;

  @ApiProperty({
    description: 'User`s age'
  })
  @IsNotEmpty()
  @IsNumber()
    age: number;
}