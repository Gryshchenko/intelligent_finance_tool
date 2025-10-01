import { TextStyle, View, ViewStyle } from "react-native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { IAccount } from "tenpercent/shared/src/interfaces/IAccount"
import { IAccountListItem } from "tenpercent/shared/src/interfaces/IAccountListItem"

import { Accounts } from "@/components/Accounts"
import { Header } from "@/components/Header"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppQuery } from "@/hooks/useAppQuery"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { AccountService } from "@/services/AccountService"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { Logger } from "@/utils/logger/Logger"

async function fetchAccounts(): Promise<IAccountListItem[]> {
  try {
    const accountService = AccountService.instance()
    const response = await accountService.doGetAccounts()
    switch (response.kind) {
      case GeneralApiProblemKind.Ok: {
        return response.data as IAccount[]
      }
      default: {
        return []
      }
    }
  } catch (e) {
    Logger.Of("FetchAccounts").error(
      `Fetch account failed due reason: ${(e as { message: string }).message}`,
    )
    return []
  }
}

type Props = BottomTabScreenProps<OverviewTabParamList, "Accounts">

export const AccountsScreen = function AccountsScreen(_props: Props) {
  const { isError, data, isPending } = useAppQuery<IAccountListItem[]>("accounts", fetchAccounts)
  const { themed, theme } = useAppTheme()

  if (isError) return <Text>Error</Text>
  if (isPending) return <Text>Pending</Text>
  return (
    <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
      <Header
        titleTx="common:balance"
        titleMode="flex"
        titleStyle={$rightAlignTitle}
        RightActionComponent={
          <View style={themed([$styles.row, $customLeftAction])}>
            <Icon icon="more" color={theme.colors.text} size={20} />
          </View>
        }
        safeAreaEdges={[]}
      />
      <Accounts accounts={data} />
    </Screen>
  )
}
const $rightAlignTitle: TextStyle = {
  textAlign: "center",
}
const $customLeftAction: ThemedStyle<ViewStyle> = () => ({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})
