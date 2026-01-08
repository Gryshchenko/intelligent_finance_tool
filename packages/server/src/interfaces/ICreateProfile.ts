import { LanguageType } from 'tenpercent/shared';

export interface ICreateProfile {
    userId: number;
    currencyId: number;
    locale: LanguageType;
    publicName: string;
}
