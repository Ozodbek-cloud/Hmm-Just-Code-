import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/role.guard';
export function Auth(...roles: UserRole[]) {
  return applyDecorators(                        // << Yangicha Usul , Info -> Hamma controller uchun Guardlar uchun
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );

}
