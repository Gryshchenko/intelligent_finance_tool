import { EmailConfirmationStatusType } from 'types/EmailConfirmationStatusType';

export interface IEmailConfirmationResponse {
    confirmationId: number;
    status: EmailConfirmationStatusType;
    expiresAt: string;
}
