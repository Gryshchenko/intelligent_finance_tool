import { LanguageType } from 'types/LanguageType';

export interface IProfileClient {
    publicName: string | undefined;
    currencyId: number | undefined;
    locale: LanguageType | undefined;
    mailConfirmed: boolean | undefined;
    additionInfo: Record<string, unknown> | undefined;
}
