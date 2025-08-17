import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import ResponseBuilder from './ResponseBuilder';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { IResponse } from 'tenpercent/shared/src/interfaces/IResponse';

export class ResponseBuilderPreset {
    public static getSuccess(): IResponse {
        return new ResponseBuilder().setStatus(ResponseStatusType.INTERNAL).setData({}).build();
    }

    public static getAuthError(): IResponse {
        return new ResponseBuilder().setStatus(ResponseStatusType.INTERNAL).setError({ errorCode: ErrorCode.AUTH_ERROR }).build();
    }
}
