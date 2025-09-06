import { ApiResponse } from "apisauce"
import { IResponse } from "tenpercent/shared/src/interfaces/IResponse"
import { HttpCode } from "tenpercent/shared/src/types/HttpCode"

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
  | ({ kind: GeneralApiProblemKind.Unauthorized } & IResponse<unknown>)
  | ({ kind: GeneralApiProblemKind.Forbidden } & IResponse<unknown>)
  | ({ kind: GeneralApiProblemKind.NotFound } & IResponse<unknown>)
  | ({ kind: GeneralApiProblemKind.Rejected } & IResponse<unknown>)
  | { kind: GeneralApiProblemKind.Unknown; temporary: true }
  | ({ kind: GeneralApiProblemKind.BadData } & IResponse<unknown>)

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
            data: response.data?.data,
            status: response.data?.status,
            errors: response.data?.errors,
          }
        case HttpCode.FORBIDDEN:
          return {
            kind: GeneralApiProblemKind.Forbidden,
            data: response.data?.data,
            status: response.data?.status,
            errors: response.data?.errors,
          }
        case HttpCode.NOT_FOUND:
          return {
            kind: GeneralApiProblemKind.NotFound,
            data: response.data?.data,
            status: response.data?.status,
            errors: response.data?.errors,
          }
        case HttpCode.BAD_REQUEST:
          return {
            kind: GeneralApiProblemKind.BadData,
            data: response.data?.data,
            status: response.data?.status,
            errors: response.data?.errors,
          }
        default:
          return {
            kind: GeneralApiProblemKind.Rejected,
            data: response.data?.data,
            status: response.data?.status,
            errors: response.data?.errors,
          }
      }
    case "CANCEL_ERROR":
      return null
  }

  return null
}
