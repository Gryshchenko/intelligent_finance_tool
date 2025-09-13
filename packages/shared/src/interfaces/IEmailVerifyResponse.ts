import { EmailConfirmationStatusType } from 'types/EmailConfirmationStatusType';

export interface IEmailVerifyResponse {
    confirmationId: number;
    status: EmailConfirmationStatusType;
}
