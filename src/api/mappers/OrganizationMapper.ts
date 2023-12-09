export class OrganizationMapper {
  getOrganizations (organizations) {
    return organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      avatar: organization.avatar,
      address: organization.address,
    }));
  }
}