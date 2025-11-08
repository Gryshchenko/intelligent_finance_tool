import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import { IPagination } from "tenpercent/shared/src/interfaces/IPagination"
import { ITransactionListItem } from "tenpercent/shared/src/interfaces/ITransactionListItem"

import { Transactions } from "@/components/transaction/Transactions"
import { useAppQuery } from "@/hooks/useAppQuery"
import { translate } from "@/i18n/translate"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"
import { fetchTransactions } from "@/screens/TransactionsScreen/TransactionsScreen"

type Props = BottomTabScreenProps<OverviewTabParamList, "transactions">

export const HistoryTransactionsScreen = function HistoryScreen(_props: Props) {
  const navigation = useNavigation()
  const { isError, data, isPending } = useAppQuery<IPagination<ITransactionListItem> | undefined>(
    ["transactions"],
    async () => fetchTransactions(undefined, undefined, 0, 10),
  )

  return (
    <GenericListScreen
      name={translate("common:history")}
      isError={isError}
      isPending={isPending}
      props={{
        data,
        fetch: async ({ cursor, limit }) =>
          await fetchTransactions(undefined, undefined, cursor, limit),
        onPress: (id: number, name: string) => {
          navigation.getParent()?.navigate("history", {
            screen: "transaction",
            params: { id, name },
          })
        },
      }}
      RenderComponent={Transactions}
    />
  )
}
