import { EmailConfirmationStatusType } from 'types/EmailConfirmationStatusType';

export interface IEmailResendResponse {
    confirmationId: number;
    status: EmailConfirmationStatusType;
    expiresAt: string;
}
