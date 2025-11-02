import { FC } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { IAccountListItem } from "tenpercent/shared/src/interfaces/IAccountListItem"
import Utils from "tenpercent/shared/src/Utils"

import { EmptyState } from "@/components/EmptyState"
import { ListItem } from "@/components/ListItem"
import { Text } from "@/components/Text"
import { useCurrency } from "@/context/CurrencyContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { CurrencyUtils } from "@/utils/CurrencyUtils"

interface IAccountsPros {
  data: IAccountListItem[] | undefined
  fetch?: () => Promise<IAccountListItem[] | undefined>
  onPress?: (id: number, name: string) => void
}

export const Accounts: FC<IAccountsPros> = function Accounts(_props) {
  const { data } = _props
  const navigation = useNavigation()
  const { themed } = useAppTheme()
  const { getCurrencySymbol } = useCurrency()

  if (!data || data.length <= 0) {
    return <EmptyState style={$containerStyleOverride} buttonOnPress={() => navigation.goBack()} />
  }

  const onPress = (accountId: number, accountName: string) => {
    if (_props.onPress) {
      _props.onPress(accountId, accountName)
    }
  }

  return (
    <>
      {data.map(({ accountName, accountId, amount, currencyId }) => {
        return (
          <ListItem
            key={accountId}
            disabled={!Utils.isNumber(accountId as unknown as string)}
            bottomSeparator
            onPress={() => onPress(accountId, accountName)}
            RightComponent={
              <Text style={themed([$centerAlign])}>
                {CurrencyUtils.formatWithDelimiter(amount, getCurrencySymbol(currencyId))}
              </Text>
            }
          >
            {accountName}
            {}
          </ListItem>
        )
      })}
    </>
  )
}
const $centerAlign: ThemedStyle<ViewStyle> = () => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  alignContent: "center",
  flexDirection: "column",
  justifyContent: "center",
})
const $containerStyleOverride: StyleProp<ViewStyle> = {
  margin: "auto",
}
