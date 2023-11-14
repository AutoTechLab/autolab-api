import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'User`s id',
  })
    id: string;

  @ApiProperty({
    description: 'User`s username',
  })
    username: string;

  @ApiProperty({
    description: 'User`s email',
  })
    email: string;

  @ApiProperty({
    description: 'User`s phone nimber',
  })
    phone: string;

  @ApiProperty({
    description: 'User`s firstname',
  })
    firstname: string;

  @ApiProperty({
    description: 'User`s lastname',
  })
    lastname: string;

  @ApiProperty({
    description: 'User`s middlename',
  })
    middlename: string;

  @ApiProperty({
    description: 'User`s birth date',
  })
    birthDate: Date;

  @ApiProperty({
    description: 'User`s avatar',
  })
  avatar: string;
}