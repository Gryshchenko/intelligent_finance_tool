import { TextStyle } from "react-native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { IAccount } from "tenpercent/shared/src/interfaces/IAccount"
import { IAccountListItem } from "tenpercent/shared/src/interfaces/IAccountListItem"

import { Accounts } from "@/components/Accounts"
import { ErrorState } from "@/components/ErrorState"
import { Header } from "@/components/Header"
import { PendingState } from "@/components/PengingState"
import { Screen } from "@/components/Screen"
import { useAppQuery } from "@/hooks/useAppQuery"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { AccountService } from "@/services/AccountService"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { $styles } from "@/theme/styles"
import { Logger } from "@/utils/logger/Logger"

export async function fetchAccounts(): Promise<IAccountListItem[]> {
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

type Props = BottomTabScreenProps<OverviewTabParamList, "accounts">

export const AccountsScreen = function AccountsScreen(_props: Props) {
  const { isError, data, isPending } = useAppQuery<IAccountListItem[]>("accounts", fetchAccounts)

  return (
    <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
      <Header
        titleTx="common:balance"
        titleMode="flex"
        titleStyle={$rightAlignTitle}
        safeAreaEdges={[]}
      />
      {isError && <ErrorState />}
      {isPending && <PendingState />}
      {!isError && !isPending && <Accounts accounts={data} />}
    </Screen>
  )
}
const $rightAlignTitle: TextStyle = {
  textAlign: "center",
}
