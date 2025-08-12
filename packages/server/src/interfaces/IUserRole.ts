import { RoleType } from 'tenpercent/shared/src/types/RoleType';

export interface IUserRole {
    userRoleId: number;
    userId: number;
    roleId: RoleType;
}
