import { FC } from "react"
import { StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { IPagination } from "tenpercent/shared/src/interfaces/IPagination"
import { ITransactionListItem } from "tenpercent/shared/src/interfaces/ITransactionListItem"
import { TransactionType } from "tenpercent/shared/src/types/TransactionType"

import { EmptyState } from "@/components/EmptyState"
import TransactionSectionList, { fetchTransactionType } from "@/components/TransactionSectionList"

interface ITransactionsPros {
  data: IPagination<ITransactionListItem> | undefined
  fetch?: fetchTransactionType
}

export const Transactions: FC<ITransactionsPros> = function Transactions(_props) {
  const { data, fetch } = _props
  const navigation = useNavigation()

  if (!data || data?.data?.length <= 0) {
    return (
      <EmptyState
        style={$styles.containerStyleOverride}
        buttonOnPress={() => navigation.goBack()}
      />
    )
  }

  const onPress = (accountId: number, accountName: string) => {
    navigation.getParent()?.navigate("Transactions", {
      screen: "Transaction",
      params: { id: accountId, name: accountName, type: TransactionType.Income },
    })
  }

  return (
    <>
      <TransactionSectionList transactions={data.data} fetch={fetch} />
    </>
  )
}

const $styles = StyleSheet.create({
  containerStyleOverride: {
    margin: "auto",
  },
})
