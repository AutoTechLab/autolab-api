import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoleRepository } from '../../api/repositories/RoleRepository';
import { NoPermissionException } from '../exceptions/NoPermissionException';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor (
    private readonly roleRepository: RoleRepository,
  ) {}

  async canActivate (context: ExecutionContext,): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const organizationId = request.params.organizationId;

    const role = await this.roleRepository.find({
      organization: organizationId,
      user: user.id,
    });

    if (!role || role.name !== 'OWNER') throw new NoPermissionException();
    return true;
  }
}