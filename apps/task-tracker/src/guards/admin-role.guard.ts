import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRoleEnum } from '@app/common/events';

export class AdminRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.user?.role === UserRoleEnum.ADMIN;
  }
}
