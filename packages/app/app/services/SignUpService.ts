import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"

import { ApiAbstract } from "@/services/api/apiAbstract"
import { GeneralApiProblem, GeneralApiProblemKind } from "@/services/api/apiProblem"
import { Logger } from "@/utils/logger/Logger"

export class SignupService extends ApiAbstract {
  protected readonly _logger: Logger = Logger.Of("SignupService")

  private static _instance: SignupService

  public static instance(): SignupService {
    return SignupService._instance || (SignupService._instance = new SignupService())
  }

  public async doSignUpEmailResend(body: { userId: number }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    try {
      await this.authPost(`/register/signup/${body.userId}/email-confirmation/resend`)
      return { kind: GeneralApiProblemKind.NoContent }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n`, e.stack)
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
  public async doSignUpEmailVerify(body: { confirmationCode: string; userId: number }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        token: string | undefined
      }
    | GeneralApiProblem
  > {
    try {
      await this.authPost(`/register/signup/${body.userId}/email-confirmation/verify`, {
        confirmationCode: body.confirmationCode,
      })

      return { kind: GeneralApiProblemKind.NoContent }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n`, e.stack)
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
  public async doSignUp(body: {
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
    try {
      return await this.publicPost(`/register/signup`, body)
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n`, e.stack)
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
}
