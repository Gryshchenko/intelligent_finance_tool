import { ResponseStatusType } from 'tenpercent/shared';
import ResponseBuilder from './ResponseBuilder';
import { ErrorCode } from 'tenpercent/shared';
import { IResponse } from 'tenpercent/shared';

export class ResponseBuilderPreset {
    public static getSuccess(): IResponse {
        return new ResponseBuilder().setStatus(ResponseStatusType.INTERNAL).setData({}).build();
    }

    public static getAuthError(): IResponse {
        return new ResponseBuilder().setStatus(ResponseStatusType.INTERNAL).setError({ errorCode: ErrorCode.AUTH_ERROR }).build();
    }
    public static getTokenExpired(): IResponse {
        return new ResponseBuilder()
            .setStatus(ResponseStatusType.INTERNAL)
            .setError({ errorCode: ErrorCode.TOKEN_EXPIRED_ERROR })
            .build();
    }
}
