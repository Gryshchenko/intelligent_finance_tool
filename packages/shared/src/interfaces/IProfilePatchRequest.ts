import { LanguageType } from 'types/LanguageType';

export interface IProfilePatchRequest {
    mailConfirmed: boolean;
    locale: LanguageType;
    currencyId: string;
    publicName: string;
}
