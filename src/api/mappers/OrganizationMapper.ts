export class OrganizationMapper {
  getOrganizations (organizations) {
    return organizations.map((organization) => this.getOrganization(organization));
  }

  getOrganization (organization) {
    return {
      id: organization.id,
      name: organization.name,
      avatar: organization.avatar,
      address: organization.address,
    };
  }
}