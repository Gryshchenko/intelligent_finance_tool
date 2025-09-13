import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"

export interface IError {
  message: string
  errorCode?: ErrorCode
}
