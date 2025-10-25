import { IPagination } from "tenpercent/shared/src/interfaces/IPagination"
import { ITransaction } from "tenpercent/shared/src/interfaces/ITransaction"
import { ITransactionListItem } from "tenpercent/shared/src/interfaces/ITransactionListItem"
import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"
import { TransactionFieldType } from "tenpercent/shared/src/types/TransactionFieldType"

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

  public async doGetTransactions({
    id,
    type,
    cursor,
    limit,
    orderBy,
  }: {
    id?: number
    type?: TransactionFieldType | undefined
    cursor?: number
    limit?: number
    orderBy?: string
  }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: IPagination<ITransactionListItem>
      }
    | GeneralApiProblem
  > {
    try {
      const field = this.validateTransactionFieldName(type)
      this._logger.info(`Start fetching transactions from ${field ?? "all"}: ${id}`)
      const userId = this._authService.userId
      const params = new URLSearchParams()
      if (field && id) {
        params.append(field, String(id))
      }
      if (cursor !== undefined) {
        params.append("cursor", String(cursor))
      }
      if (limit !== undefined) {
        params.append("limit", String(limit))
      }
      if (orderBy) {
        params.append("orderBy", orderBy)
      }
      const queryString = params.toString()

      const response = await this.authGet(
        `/user/${userId}/transactions${queryString ? `?${queryString}` : ""}`,
      )
      if (response.kind === GeneralApiProblemKind.Ok) {
        this._logger.info(
          `Fetching transactions successfully: ${(response.data as IPagination<ITransactionListItem>)?.data?.length}`,
        )
      } else {
        this._logger.info(`Fetching transaction failed: ${response.kind}`)
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
  public async doGetTransaction({ id }: { id: number | string }): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: IPagination<ITransaction>
      }
    | GeneralApiProblem
  > {
    try {
      this._logger.info(`Start fetching transaction id: ${id}`)
      const userId = this._authService.userId
      const response = await this.authGet(`/user/${userId}/transaction/${id}`)
      if (response.kind === GeneralApiProblemKind.Ok) {
        this._logger.info(
          `Fetching transaction successfully: ${(response.data as ITransaction)?.transactionId}`,
        )
      } else {
        this._logger.info(`Fetching transaction failed: ${response.kind}`)
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

  public async doDeleteTransaction(id: number): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: IPagination<ITransaction>
      }
    | GeneralApiProblem
  > {
    try {
      this._logger.info(`Start deleting transaction id: ${id}`)
      const userId = this._authService.userId
      const response = await this.authDelete(`/user/${userId}/transaction/${id}`)
      if (response.kind === GeneralApiProblemKind.Ok) {
        this._logger.info(
          `Delete transaction successfully: ${(response.data as ITransaction)?.transactionId}`,
        )
      } else {
        this._logger.info(`Delete transaction failed: ${response.kind}`)
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

  protected validateTransactionFieldName(
    type: TransactionFieldType | undefined,
  ): TransactionFieldType | undefined {
    switch (type) {
      case TransactionFieldType.Category:
        return TransactionFieldType.Category
      case TransactionFieldType.Income:
        return TransactionFieldType.Income
      case TransactionFieldType.Account:
        return TransactionFieldType.Account
      default:
        return undefined
    }
  }
}
