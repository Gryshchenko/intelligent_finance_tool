import { ICategory } from "tenpercent/shared/src/interfaces/ICategory"
import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"

import { ApiAbstract } from "@/services/api/apiAbstract"
import { GeneralApiProblem, GeneralApiProblemKind } from "@/services/api/apiProblem"
import { AuthService } from "@/services/AuthService"
import { Logger } from "@/utils/logger/Logger"

export class CategoriesService extends ApiAbstract {
  protected readonly _logger: Logger = Logger.Of("CategoriesService")
  private readonly _authService: AuthService

  private static _instance: CategoriesService

  public static instance(): CategoriesService {
    return (
      CategoriesService._instance ||
      (CategoriesService._instance = new CategoriesService(AuthService.instance()))
    )
  }

  constructor(authService: AuthService) {
    super()
    this._authService = authService
  }

  public async doGetCategories(): Promise<
    | {
        kind: GeneralApiProblemKind.Ok
        data: ICategory[]
      }
    | GeneralApiProblem
  > {
    try {
      this._logger.info(`Start fetching categories from`)
      const userId = this._authService.userId
      const response = await this.authGet(`/user/${userId}/categories`)
      if (response.kind === GeneralApiProblemKind.Ok) {
        this._logger.info(
          `Fetching categories successfully: ${(response.data as ICategory[])?.length}`,
        )
      } else {
        this._logger.info(`Fetching categories failed: ${response.kind}`)
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
