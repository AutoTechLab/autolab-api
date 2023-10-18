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
    email: String;

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
    description: 'User`s age',
  })
    age: number;

  @ApiProperty({
    description: 'User`s state',
  })
    state: string;
}