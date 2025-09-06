import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { IResponse } from "tenpercent/shared/src/interfaces/IResponse"
import { IResponseError } from "tenpercent/shared/src/interfaces/IResponseError"
import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"
import { ResponseStatusType } from "tenpercent/shared/src/types/ResponseStatusType"

import Config from "@/config"
import { IRefreshResponse } from "@/interfaces/IRefreshResponse"
import {
  GeneralApiProblem,
  GeneralApiProblemKind,
  getGeneralApiProblem,
} from "@/services/api/apiProblem"
import type { ApiConfig } from "@/services/api/types"
import { AuthService } from "@/services/AuthService"
import { Logger } from "@/utils/logger/Logger"

export const DEFAULT_API_CONFIG = {
  url: Config.API_URL,
  timeout: 10000,
}

const MAX_TRY = 1

export abstract class ApiAbstract {
  private apisauce: ApisauceInstance
  private config: ApiConfig
  protected _logger: Logger = Logger.Of("ApiAbstract")

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  private async refresh(): Promise<boolean> {
    try {
      const userId = AuthService.instance().userId
      const tokenLong = await AuthService.instance().getTokenLong()
      if (!userId) throw new Error("refresh failed userId empty")
      const response: ApiResponse<IResponse<IRefreshResponse>> = await this.apisauce.post(
        `auth/${userId}/refresh`,
        { token: tokenLong },
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        this._logger.error("refresh failed problem", JSON.stringify(problem))
        return false
      }
      const newToken = response.data?.data?.token
      if (!newToken) throw new Error("refresh failed token empty")
      AuthService.instance().token = newToken
      this._logger.info("Token update on refresh")
      return true
    } catch (e) {
      this._logger.error("Token refresh failed due reason", e)
      return false
    }
  }

  private async withRetry<T>(
    fn: () => Promise<ApiResponse<IResponse<T>>>,
  ): Promise<GeneralApiProblem<T>> {
    let counter = 0
    while (counter < MAX_TRY) {
      const response = await fn()
      counter++
      if (response.ok) {
        return {
          kind: GeneralApiProblemKind.Ok,
          data: response.data?.data as T,
          errors: response.data?.errors,
          status: response.data?.status,
        }
      }
      const errors = response.data?.errors as IResponseError[]
      if (errors?.some((e) => e.errorCode !== ErrorCode.TOKEN_EXPIRED_ERROR)) {
        return getGeneralApiProblem(response) as GeneralApiProblem<T>
      }
      this._logger.info("Request token update on refresh")
      const isSuccess = await this.refresh()
      if (isSuccess) {
        continue
      } else {
        await AuthService.instance().unauthorize()
        break
      }
    }
    return {
      kind: GeneralApiProblemKind.BadData,
      data: null,
      errors: [{ errorCode: ErrorCode.CLIENT_UNKNOWN_ERROR }],
      status: ResponseStatusType.INTERNAL,
    }
  }

  private getAuthError<T>(): GeneralApiProblem<T> {
    return {
      kind: GeneralApiProblemKind.Unauthorized,
      errors: [{ errorCode: ErrorCode.AUTH_ERROR }],
      status: ResponseStatusType.INTERNAL,
      data: null,
    }
  }
  private isAuthTokenExist(): boolean {
    return AuthService.instance().token !== undefined && AuthService.instance().token !== null
  }

  protected async publicPost<T>(
    url: string,
    body?: Record<string, unknown>,
  ): Promise<GeneralApiProblem<T>> {
    try {
      const response: ApiResponse<IResponse<T>> = await this.apisauce.post(url, body)
      if (response.ok) {
        return {
          kind: GeneralApiProblemKind.Ok,
          data: response.data?.data as T,
          errors: response.data?.errors,
          status: response.data?.status,
        }
      }
      return getGeneralApiProblem(response) as GeneralApiProblem<T>
    } catch (e) {
      this._logger.error("publicPost failed due reason", e)
      return {
        kind: GeneralApiProblemKind.BadData,
        data: null,
        errors: undefined,
        status: ResponseStatusType.INTERNAL,
      }
    }
  }
  protected async authPost<T>(
    url: string,
    body?: Record<string, unknown>,
    token = AuthService.instance().token,
  ): Promise<GeneralApiProblem<T>> {
    if (!this.isAuthTokenExist()) {
      return this.getAuthError<T>()
    }

    return await this.withRetry(
      async () =>
        await this.apisauce.post(url, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
    )
  }

  protected async authGet<T>(
    url: string,
    token = AuthService.instance().token,
  ): Promise<GeneralApiProblem<T>> {
    if (!this.isAuthTokenExist()) return this.getAuthError()
    return await this.withRetry(async () => {
      const response: ApiResponse<IResponse<T>> = await this.apisauce.get(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response
    })
  }
}
