import { RoleType } from 'tenpercent/shared/src/types/RoleType';

export interface IDecodeOptions extends DelayOptions {
    userId: string;
    roule: RoleType;
}
