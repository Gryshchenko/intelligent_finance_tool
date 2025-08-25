import { IResponseError } from 'interfaces/IResponseError';
import { ResponseStatusType } from 'types/ResponseStatusType';

export interface IResponse<T = unknown> {
    status: ResponseStatusType | undefined;
    data: T;
    errors: IResponseError[] | undefined;
}
