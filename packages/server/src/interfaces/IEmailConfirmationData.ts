import { EmailConfirmationStatusType } from 'tenpercent/shared/src/types/EmailConfirmationStatusType';

export interface IEmailConfirmationData {
    confirmationId: number;
    userId: number;
    email: string;
    confirmationCode: number;
    expiresAt: Date;
    status: EmailConfirmationStatusType;
}
