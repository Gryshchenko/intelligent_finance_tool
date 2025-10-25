import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ITransaction } from "tenpercent/shared/src/interfaces/ITransaction"

import { Transaction } from "@/components/Transaction"
import { useAppQuery } from "@/hooks/useAppQuery"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { TransactionsService } from "@/services/TransactionsService"
import { Logger } from "@/utils/logger/Logger"

async function fetchTransaction(id: number | string): Promise<ITransaction | undefined> {
  try {
    const transactionsService = TransactionsService.instance()
    const response = await transactionsService.doGetTransaction({
      id,
    })
    switch (response.kind) {
      case GeneralApiProblemKind.Ok: {
        return response.data as ITransaction
      }
      default: {
        return undefined
      }
    }
  } catch (e) {
    Logger.Of("FetchTransaction").error(
      `Fetch transaction failed due reason: ${(e as { message: string }).message}`,
    )
    return undefined
  }
}

type Props = NativeStackScreenProps<OverviewTabParamList, "transaction">

export const TransactionScreen = function TransactionsScreen(_props: Props) {
  const params = _props?.route?.params as { id: number; name: string }
  const navigation = useNavigation()
  const { id, name } = params
  const { isError, data, isPending } = useAppQuery<ITransaction | undefined>(
    ["transaction", id],
    async () => fetchTransaction(id),
  )

  return (
    <GenericListScreen
      name={name}
      isError={isError}
      isPending={isPending}
      data={data}
      onBack={() => navigation.goBack()}
      RenderComponent={Transaction}
    />
  )
}
