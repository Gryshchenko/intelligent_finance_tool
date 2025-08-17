import { LanguageType } from 'types/LanguageType';

export interface IProfilePatchRequest {
    locale: LanguageType;
    currencyId: string;
    publicName: string;
}
