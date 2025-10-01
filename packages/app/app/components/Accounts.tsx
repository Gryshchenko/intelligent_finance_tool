import { FC } from "react"
import { ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { IAccountListItem } from "tenpercent/shared/src/interfaces/IAccountListItem"
import Utils from "tenpercent/shared/src/Utils"

import { EmptyState } from "@/components/EmptyState"
import { ListItem } from "@/components/ListItem"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface IAccountsPros {
  accounts: IAccountListItem[]
}

export const Accounts: FC<IAccountsPros> = function Accounts(_props) {
  const { accounts } = _props
  const navigation = useNavigation()
  const { themed } = useAppTheme()

  if (accounts.length <= 0) {
    return <EmptyState />
  }

  const onPress = (accountId: number, accountName: string) => {
    navigation
      .getParent()
      ?.navigate("Accounts", { screen: "Account", params: { accountId, accountName } })
  }

  return (
    <>
      {accounts.map(({ accountName, accountId, amount, currencyId }) => {
        return (
          <ListItem
            key={accountId}
            disabled={!Utils.isNumber(accountId as unknown as string)}
            bottomSeparator
            onPress={() => onPress(accountId, accountName)}
            RightComponent={
              <Text style={themed([$centerAlign])}>
                {amount} {currencyId}
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
})
