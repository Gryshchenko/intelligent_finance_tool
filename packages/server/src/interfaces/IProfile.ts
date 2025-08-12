import { LanguageType } from 'tenpercent/shared/src/types/LanguageType';

export interface IProfile {
    profileId: number;
    userId: number;
    publicName: string;
    currencyId: number;
    locale: LanguageType;
    mailConfirmed: boolean;
    additionInfo: Record<string, unknown>;
}
