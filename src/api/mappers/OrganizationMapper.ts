import { Organization } from '../schemas/OrganizationSchema';

export class OrganizationMapper {
  getOrganizations (organizations: Organization[]) {
    return organizations.map((organization) => this.getOrganization(organization));
  }

  getOrganization (organization: Organization) {
    return {
      id: organization.id,
      name: organization.name,
      avatar: organization.avatar,
      address: organization.address,
      role: organization.employees[0].roles[0].name,
    };
  }
}