import { IResponseError } from 'interfaces/IResponseError';
import { ResponseStatusType } from 'types/ResponseStatusType';

export interface IResponse<T = unknown> {
    status: ResponseStatusType | null;
    data: T;
    errors: IResponseError[] | null;
}
