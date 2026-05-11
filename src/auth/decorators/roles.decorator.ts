import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
// Refactored to use Role enum instead of raw strings for type safety
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
