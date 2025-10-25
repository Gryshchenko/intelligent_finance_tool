import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { IPagination } from "tenpercent/shared/src/interfaces/IPagination"
import { ITransactionListItem } from "tenpercent/shared/src/interfaces/ITransactionListItem"
import { TransactionFieldType } from "tenpercent/shared/src/types/TransactionFieldType"

import { Transactions } from "@/components/Transactions"
import { useAppQuery } from "@/hooks/useAppQuery"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { TransactionsService } from "@/services/TransactionsService"
import { Logger } from "@/utils/logger/Logger"

async function fetchTransactions(
  id: number | undefined,
  type: TransactionFieldType | undefined,
  cursor: number,
  limit: number,
): Promise<IPagination<ITransactionListItem> | undefined> {
  try {
    const transactionsService = TransactionsService.instance()
    const response = await transactionsService.doGetTransactions({
      cursor,
      limit,
      id,
      type,
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
      `Fetch transactions failed due reason: ${(e as { message: string }).message}`,
    )
    return undefined
  }
}

type Props = NativeStackScreenProps<OverviewTabParamList, "transactions">

export const TransactionsScreen = function TransactionsScreen(_props: Props) {
  const params = _props?.route?.params as { id: number; name: string; type: TransactionFieldType }
  const navigation = useNavigation()
  const { id, type, name } = params
  const { isError, data, isPending } = useAppQuery<IPagination<ITransactionListItem> | undefined>(
    ["transactions", id, type],
    async () => fetchTransactions(id, type, 0, 10),
  )

  return (
    <GenericListScreen
      name={name}
      isError={isError}
      isPending={isPending}
      data={data}
      onBack={() => navigation.goBack()}
      RenderComponent={Transactions}
      fetch={({ cursor, limit }) => fetchTransactions(undefined, undefined, cursor, limit)}
    />
  )
}
