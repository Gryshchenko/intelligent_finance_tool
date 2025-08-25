/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { IResponse } from "tenpercent/shared/src/interfaces/IResponse"
import { IUserClient } from "tenpercent/shared/src/interfaces/IUserClient"
import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"

import Config from "@/config"

import { GeneralApiProblem, GeneralApiProblemKind, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig } from "./types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
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

  async doSignUpEmailResend(body: { userId: number }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    const response: ApiResponse<IResponse<IUserClient | undefined>> = await this.apisauce.post(
      `/register/signup/${body.userId}/email-confirmation/resend`,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: GeneralApiProblemKind.NoContent, token: response.headers?.authorization }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {
        kind: GeneralApiProblemKind.BadData,
        status: undefined,
        data: null,
        errors: [
          {
            errorCode: ErrorCode.CLIENT_UNKNOWN_ERROR,
          },
        ],
      }
    }
  }
  async doSignUpEmailVerify(body: { confirmationCode: string; userId: number }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    const response: ApiResponse<IResponse<IUserClient | undefined>> = await this.apisauce.post(
      `/register/signup/${body.userId}/email-confirmation/verify`,
      {
        confirmationCode: body.confirmationCode,
      },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: GeneralApiProblemKind.NoContent, token: response.headers?.authorization }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {
        kind: GeneralApiProblemKind.BadData,
        status: undefined,
        data: null,
        errors: [
          {
            errorCode: ErrorCode.CLIENT_UNKNOWN_ERROR,
          },
        ],
      }
    }
  }
  async doSignUp(body: {
    password: string
    email: string
    publicName: string
    locale: string
  }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: { userId: number } | undefined
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    const response: ApiResponse<IResponse<{ userId: number }>> = await this.apisauce.post(
      `/register/signup`,
      body,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data = response.data?.data
      return { kind: GeneralApiProblemKind.Ok, data, token: response.headers?.authorization }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {
        kind: GeneralApiProblemKind.BadData,
        status: undefined,
        data: null,
        errors: [
          {
            errorCode: ErrorCode.CLIENT_UNKNOWN_ERROR,
          },
        ],
      }
    }
  }
  async doLogin(body: { password: string; email: string }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: IUserClient | undefined
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    const response: ApiResponse<IResponse<IUserClient>> = await this.apisauce.post(
      `/auth/login`,
      body,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data = response.data?.data
      return { kind: GeneralApiProblemKind.Ok, data, token: response.headers?.authorization }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {
        kind: GeneralApiProblemKind.BadData,
        status: undefined,
        data: null,
        errors: [
          {
            errorCode: ErrorCode.CLIENT_UNKNOWN_ERROR,
          },
        ],
      }
    }
  }
  async doTokenVerify(body: { token: string }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: IUserClient | undefined
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    const response: ApiResponse<IResponse<IUserClient>> = await this.apisauce.post(
      `/auth/login`,
      body,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data = response.data?.data
      return { kind: GeneralApiProblemKind.Ok, data, token: response.headers?.authorization }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {
        kind: GeneralApiProblemKind.BadData,
        status: undefined,
        data: null,
        errors: [
          {
            errorCode: ErrorCode.AUTH_ERROR,
          },
        ],
      }
    }
  }
}

export const api = new Api()
