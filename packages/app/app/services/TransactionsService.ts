import { IAccount } from "tenpercent/shared/src/interfaces/IAccount"
import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"

import { ApiAbstract } from "@/services/api/apiAbstract"
import { GeneralApiProblem, GeneralApiProblemKind } from "@/services/api/apiProblem"
import { AuthService } from "@/services/AuthService"
import { Logger } from "@/utils/logger/Logger"

export class TransactionsService extends ApiAbstract {
  protected readonly _logger: Logger = Logger.Of("TransactionsService")
  private readonly _authService: AuthService

  private static _instance: TransactionsService

  public static instance(): TransactionsService {
    return (
      TransactionsService._instance ||
      (TransactionsService._instance = new TransactionsService(AuthService.instance()))
    )
  }

  constructor(authService: AuthService) {
    super()
    this._authService = authService
  }

  public async doGetTransactions(accountId: number): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: IAccount | undefined
      }
    | GeneralApiProblem
  > {
    try {
      this._logger.info("Start fetching transactions from accountId: " + accountId)
      const userId = this._authService.userId
      const response = await this.authGet(`/user/${userId}/account/${accountId}`)
      if (response.kind === GeneralApiProblemKind.Ok) {
        this._logger.info(
          `Fetching account successfully: ${(response.data as IAccount)?.accountId}`,
        )
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
}
