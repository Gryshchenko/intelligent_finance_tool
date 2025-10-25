import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"
import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"

import { ApiAbstract } from "@/services/api/apiAbstract"
import { GeneralApiProblem, GeneralApiProblemKind } from "@/services/api/apiProblem"
import { AuthService } from "@/services/AuthService"
import { Logger } from "@/utils/logger/Logger"

export class IncomeService extends ApiAbstract {
  protected readonly _logger: Logger = Logger.Of("IncomeService")
  private readonly _authService: AuthService

  private static _instance: IncomeService

  public static instance(): IncomeService {
    return (
      IncomeService._instance ||
      (IncomeService._instance = new IncomeService(AuthService.instance()))
    )
  }

  constructor(authService: AuthService) {
    super()
    this._authService = authService
  }

  public async doGetIncome(incometId: number): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: IIncome | undefined
      }
    | GeneralApiProblem
  > {
    try {
      this._logger.info("Start fetching incomes")
      const userId = this._authService.userId
      const response = await this.authGet(`/user/${userId}/income/${incometId}`)
      if (response.kind === GeneralApiProblemKind.Ok) {
        this._logger.info(`Fetching account successfully: ${(response.data as IIncome)?.incomeId}`)
      } else {
        this._logger.info(`Fetching account failed: ${response.kind}`)
      }
      return response
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        this._logger.error(`Bad data: ${e.message}\n}`, e.stack)
      }
      return {
        kind: GeneralApiProblemKind.BadData,
        status: undefined,
        data: undefined,
        errors: [
          {
            errorCode: ErrorCode.CLIENT_UNKNOWN_ERROR,
          },
        ],
      }
    }
  }

  public async doGetIncomes(): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: IIncome[] | undefined
      }
    | GeneralApiProblem
  > {
    try {
      this._logger.info("Start fetching incomes")
      const userId = this._authService.userId
      const response = await this.authGet(`/user/${userId}/incomes`)
      if (response.kind === GeneralApiProblemKind.Ok) {
        this._logger.info(`Fetching incomes successfully: ${(response.data as [])?.length}`)
      } else {
        this._logger.info(`Fetching incomes failed: ${response.kind}`)
      }
      return response
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        this._logger.error(`Bad data: ${e.message}\n}`, e.stack)
      }
      return {
        kind: GeneralApiProblemKind.BadData,
        status: undefined,
        data: undefined,
        errors: [
          {
            errorCode: ErrorCode.CLIENT_UNKNOWN_ERROR,
          },
        ],
      }
    }
  }
}
