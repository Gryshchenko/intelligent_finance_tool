import { FC } from "react"
import { IPagination } from "tenpercent/shared/src/interfaces/IPagination"
import { ITransactionListItem } from "tenpercent/shared/src/interfaces/ITransactionListItem"

import { Transactions } from "@/components/Transactions"
import { useAppQuery } from "@/hooks/useAppQuery"
import { translate } from "@/i18n/translate"
import { MainTabScreenProps } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { TransactionsService } from "@/services/TransactionsService"
import { Logger } from "@/utils/logger/Logger"

async function fetchTransactions(
  cursor: number,
  limit: number,
): Promise<IPagination<ITransactionListItem> | undefined> {
  try {
    const transactionsService = TransactionsService.instance()
    const response = await transactionsService.doGetTransactions({
      cursor,
      limit,
    })
    switch (response.kind) {
      case GeneralApiProblemKind.Ok: {
        return response.data as IPagination<ITransactionListItem>
      }
      default: {
        return undefined
      }
    }
  } catch (e) {
    Logger.Of("FetchTransactions").error(
      `Fetch history failed due reason: ${(e as { message: string }).message}`,
    )
    return undefined
  }
}
export const HistoryScreen: FC<MainTabScreenProps<"history">> = function HistoryScreen(_props) {
  const { isError, data, isPending } = useAppQuery<IPagination<ITransactionListItem> | undefined>(
    ["history"],
    async () => fetchTransactions(0, 10),
  )

  return (
    <GenericListScreen
      name={translate("common:history")}
      isError={isError}
      isPending={isPending}
      data={data}
      fetch={({ cursor, limit }) => fetchTransactions(cursor, limit)}
      RenderComponent={Transactions}
    />
  )
}
