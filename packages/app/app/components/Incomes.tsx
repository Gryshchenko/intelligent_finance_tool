import { FC } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"
import Utils from "tenpercent/shared/src/Utils"

import { $center } from "@/components/CategoriesSectionList"
import { EmptyState } from "@/components/EmptyState"
import { ListItem } from "@/components/ListItem"
import { Text } from "@/components/Text"
import { useCurrency } from "@/context/CurrencyContext"
import { useAppTheme } from "@/theme/context"
import { CurrencyUtils } from "@/utils/CurrencyUtils"

interface IIncomesPros {
  data: IIncome[] | undefined
  fetch?: () => Promise<IIncome[] | undefined>
  onPress?: (id: number, name: string) => void
}

export const Incomes: FC<IIncomesPros> = function Incomes(_props) {
  const { data } = _props
  const navigation = useNavigation()
  const { themed } = useAppTheme()
  const { getCurrencySymbol } = useCurrency()

  if (!data || data?.length <= 0) {
    return <EmptyState style={$containerStyleOverride} buttonOnPress={() => navigation.goBack()} />
  }

  const onPress = (accountId: number, accountName: string) => {
    navigation.getParent()?.navigate("incomes", {
      screen: "view",
      params: { id: accountId, name: accountName },
    })
  }

  return (
    <>
      {data.map(({ incomeId, incomeName, currencyId }) => {
        return (
          <ListItem
            key={incomeId}
            disabled={!Utils.isNumber(incomeId as unknown as string)}
            bottomSeparator
            RightComponent={
              <Text style={themed([$center])}>
                {CurrencyUtils.formatWithDelimiter(0, getCurrencySymbol(currencyId))}
              </Text>
            }
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
