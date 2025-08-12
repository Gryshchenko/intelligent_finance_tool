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

import Config from "@/config"

import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
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

  async doSignUpConfirmation(body: { confirmationCode: string; userId: string }): Promise<
    | {
        kind: "ok"
        data: IResponse<IUserClient | undefined> | undefined
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<IResponse<IUserClient | undefined>> = await this.apisauce.patch(
      `/${body.userId}/profile`,
      {
        confirmationCode: body.confirmationCode,
      },
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const data = response.data
      return { kind: "ok", data }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  async doSignUp(body: {
    password: string
    email: string
    publicName: string
    locale: string
  }): Promise<
    | {
        kind: "ok"
        data: IResponse<IUserClient | undefined> | undefined
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<IResponse<IUserClient | undefined>> = await this.apisauce.post(
      `/register/signup`,
      body,
    )
    console.log(response)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const data = response.data
      return { kind: "ok", data, token: response.headers?.authorization }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
