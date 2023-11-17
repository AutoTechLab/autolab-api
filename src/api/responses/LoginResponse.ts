import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    description: 'User`s access token',
  })
    accessToken: string;
}

export class LoginBody {
  @ApiProperty({
    description: 'User`s email or username',
  })
    username: string;

  @ApiProperty({
    description: 'User`s password',
  })
    password: string;
}