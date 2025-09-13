import { ApiResponse } from "apisauce"
import { IResponse } from "tenpercent/shared/src/interfaces/IResponse"
import { HttpCode } from "tenpercent/shared/src/types/HttpCode"
import { ResponseStatusType } from "tenpercent/shared/src/types/ResponseStatusType"

import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import AlertService from "@/services/AlertService"
import { BaseError } from "@/utils/errors/BaseError"

/**
 * Enum representing the possible types of general API problems.
 */
export enum GeneralApiProblemKind {
  Ok = "ok", // Ok
  NoContent = "NoContent", // Ok
  Timeout = "timeout", // The request timed out
  CannotConnect = "cannot-connect", // Unable to connect to the server
  Server = "server", // Server-side error (5xx)
  Unauthorized = "unauthorized", // Authentication required (401)
  Forbidden = "forbidden", // Access denied (403)
  NotFound = "not-found", // Resource not found (404)
  Rejected = "rejected", // Other client-side error (4xx)
  Unknown = "unknown", // Unexpected error
  BadData = "bad-data", // Malformed or unexpected response data
}
/**
 * A union type describing common API problems.
 */
export type GeneralApiProblem<T = unknown> =
  | ({ kind: GeneralApiProblemKind.Ok } & IResponse<T>)
  | { kind: GeneralApiProblemKind.NoContent }
  | { kind: GeneralApiProblemKind.Timeout; temporary: true }
  | { kind: GeneralApiProblemKind.CannotConnect; temporary: true }
  | { kind: GeneralApiProblemKind.Server }
  | ({ kind: GeneralApiProblemKind.Unauthorized } & IResponse<undefined>)
  | ({ kind: GeneralApiProblemKind.Forbidden } & IResponse<undefined>)
  | ({ kind: GeneralApiProblemKind.NotFound } & IResponse<undefined>)
  | ({ kind: GeneralApiProblemKind.Rejected } & IResponse<undefined>)
  | { kind: GeneralApiProblemKind.Unknown; temporary: true }
  | ({ kind: GeneralApiProblemKind.BadData } & IResponse<undefined>)

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */

export function getGeneralApiProblem(response: ApiResponse<IResponse>): GeneralApiProblem | null {
  switch (response.problem) {
    case "CONNECTION_ERROR":
    case "NETWORK_ERROR":
      return { kind: GeneralApiProblemKind.CannotConnect, temporary: true }
    case "TIMEOUT_ERROR":
      return { kind: GeneralApiProblemKind.Timeout, temporary: true }
    case "SERVER_ERROR":
      return { kind: GeneralApiProblemKind.Server }
    case "UNKNOWN_ERROR":
      return { kind: GeneralApiProblemKind.Unknown, temporary: true }
    case "CLIENT_ERROR":
      switch (response.status) {
        case HttpCode.UNAUTHORIZED:
          return {
            kind: GeneralApiProblemKind.Unauthorized,
            data: undefined,
            status: response.data?.status,
            errors: response.data?.errors,
          }
        case HttpCode.FORBIDDEN:
          return {
            kind: GeneralApiProblemKind.Forbidden,
            data: undefined,
            status: response.data?.status,
            errors: response.data?.errors,
          }
        case HttpCode.NOT_FOUND:
          return {
            kind: GeneralApiProblemKind.NotFound,
            data: undefined,
            status: response.data?.status,
            errors: response.data?.errors,
          }
        case HttpCode.BAD_REQUEST:
          return {
            kind: GeneralApiProblemKind.BadData,
            data: undefined,
            status: response.data?.status,
            errors: response.data?.errors,
          }
        default:
          return {
            kind: GeneralApiProblemKind.Rejected,
            data: undefined,
            status: response.data?.status,
            errors: response.data?.errors,
          }
      }
    case "CANCEL_ERROR":
      return null
  }

  return null
}

export function buildGeneralApiBadData(error: BaseError): GeneralApiProblem {
  return {
    kind: GeneralApiProblemKind.BadData,
    data: undefined,
    status: ResponseStatusType.APP,
    errors: [error.build()],
  }
}

export function buildGeneralApiBaseHandler(
  problem: GeneralApiProblem,
  handler: (text: TxKeyPath) => void = (text: TxKeyPath) => AlertService.error(translate(text)),
): void {
  switch (problem.kind) {
    case GeneralApiProblemKind.Forbidden:
      handler("errorCode.FORBIDDEN_ERROR" as TxKeyPath)
      break
    case GeneralApiProblemKind.Rejected:
      handler("errorCode.REJECTED_ERROR" as TxKeyPath)
      break
    case GeneralApiProblemKind.Server:
      handler("errorCode.SERVER_ERROR" as TxKeyPath)
      break
    case GeneralApiProblemKind.Timeout:
      handler("errorCode.REQUEST_TIMEOUT_ERROR" as TxKeyPath)
      break
    case GeneralApiProblemKind.Unauthorized:
      handler("errorCode.UNAUTHORIZED_ERROR" as TxKeyPath)
      break
    case GeneralApiProblemKind.Unknown:
      handler("errorCode.UNKNOWN_ERROR" as TxKeyPath)
      break
    case GeneralApiProblemKind.NotFound:
      handler("errorCode.NOT_FOUND_ERROR" as TxKeyPath)
      break
    case GeneralApiProblemKind.CannotConnect:
      handler("errorCode.CANNOT_CONNECT_ERROR" as TxKeyPath)
      break
  }
}
