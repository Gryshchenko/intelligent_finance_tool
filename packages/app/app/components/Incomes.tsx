import { FC } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"
import { TransactionFieldType } from "tenpercent/shared/src/types/TransactionFieldType"
import Utils from "tenpercent/shared/src/Utils"

import { EmptyState } from "@/components/EmptyState"
import { ListItem } from "@/components/ListItem"

interface IIncomesPros {
  incomes: IIncome[]
}

export const Incomes: FC<IIncomesPros> = function Incomes(_props) {
  const { incomes } = _props
  const navigation = useNavigation()

  if (incomes.length <= 0) {
    return <EmptyState style={$containerStyleOverride} buttonOnPress={() => navigation.goBack()} />
  }

  const onPress = (accountId: number, accountName: string) => {
    navigation.getParent()?.navigate("balances", {
      screen: "transactions",
      params: { id: accountId, name: accountName, type: TransactionFieldType.Income },
    })
  }

  return (
    <>
      {incomes.map(({ incomeId, incomeName }) => {
        return (
          <ListItem
            key={incomeId}
            disabled={!Utils.isNumber(incomeId as unknown as string)}
            bottomSeparator
            onPress={() => onPress(incomeId, incomeName)}
          >
            {incomeName}
          </ListItem>
        )
      })}
    </>
  )
}
const $containerStyleOverride: StyleProp<ViewStyle> = {
  margin: "auto",
}
