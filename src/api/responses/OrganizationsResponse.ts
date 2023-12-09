import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponse {
  @ApiProperty({
    description: 'Organization\'s id',
  })
    id: string;

  @ApiProperty({
    description: 'Organization\'s name',
  })
    name: string;

  @ApiProperty({
    description: 'Organization\'s avatar',
  })
    avatar: string;

  @ApiProperty({
    description: 'Organization\'s address',
  })
    address: string;
}

export class OrganizationsResponse {
  @ApiProperty({
    type: [OrganizationResponse],
    description: 'Short information about organizations',
  })
    organizations: OrganizationResponse[];
}