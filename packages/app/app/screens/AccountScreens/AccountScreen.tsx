import { TextStyle, View, ViewStyle } from "react-native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { IAccount } from "tenpercent/shared/src/interfaces/IAccount"

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

async function fetchTransactions(accountId: number): Promise<IAccount | null> {
  try {
    const accountService = AccountService.instance()
    const response = await accountService.doGetAccount(accountId)
    switch (response.kind) {
      case GeneralApiProblemKind.Ok: {
        console.log(response.data)
        return response.data as IAccount
      }
      default: {
        return null
      }
    }
  } catch (e) {
    Logger.Of("FetchAccount").error(
      `Fetch account failed due reason: ${(e as { message: string }).message}`,
    )
    return null
  }
}

type Props = BottomTabScreenProps<OverviewTabParamList, "Account">

export const AccountScreen = function Account(_props: Props) {
  // @ts-ignore
  const accountId = _props.route?.params?.accountId
  // @ts-ignore
  const accountName = _props.route?.params?.accountName
  const { themed, theme } = useAppTheme()
  const { isError, data, isPending } = useAppQuery<IAccount | null>(
    ["transactions", accountId],
    async () => fetchTransactions(accountId),
  )

  if (isError) return <Text>Error</Text>
  if (isPending) return <Text>Pending</Text>
  return (
    <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
      <Header
        title={accountName}
        titleMode="flex"
        titleStyle={$rightAlignTitle}
        RightActionComponent={
          <View style={themed([$styles.row, $customLeftAction])}>
            <Icon icon="edit" color={theme.colors.text} size={20} />
          </View>
        }
        safeAreaEdges={[]}
      />
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
