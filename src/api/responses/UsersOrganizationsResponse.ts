import { OrganizationResponse } from './OrganizationsResponse';
import { ApiProperty } from '@nestjs/swagger';

export class UsersOrganizationResponse extends OrganizationResponse {
  @ApiProperty()
    role: string;
}

export class UsersOrganizationsResponse {
  @ApiProperty({
    type: [UsersOrganizationResponse],
  })
    organizations: UsersOrganizationResponse[];
}