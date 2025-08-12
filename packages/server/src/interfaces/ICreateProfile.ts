import { LanguageType } from 'tenpercent/shared/src/types/LanguageType';

export interface ICreateProfile {
    userId: number;
    currencyId: number;
    locale: LanguageType;
    publicName: string;
}
