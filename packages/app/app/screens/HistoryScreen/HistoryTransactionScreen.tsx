import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ITransaction } from "tenpercent/shared/src/interfaces/ITransaction"

import { Transaction } from "@/components/Transaction"
import { useAppQuery } from "@/hooks/useAppQuery"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"
import { fetchTransaction } from "@/screens/TransactionsScreen/TransactionScreen"

type Props = NativeStackScreenProps<OverviewTabParamList, "transaction">

export const HistoryTransactionScreen = function HistoryTransactionScreen(_props: Props) {
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
      props={{
        data,
      }}
      onBack={() => navigation.getParent()?.navigate("overview", { screen: "history", params: {} })}
      RenderComponent={Transaction}
    />
  )
}
