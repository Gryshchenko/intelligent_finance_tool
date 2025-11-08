import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import { IAccount } from "tenpercent/shared/src/interfaces/IAccount"
import { IAccountListItem } from "tenpercent/shared/src/interfaces/IAccountListItem"
import { TransactionFieldType } from "tenpercent/shared/src/types/TransactionFieldType"

import { Accounts } from "@/components/account/Accounts"
import { AddButton } from "@/components/buttons/AddButton"
import { useAppQuery } from "@/hooks/useAppQuery"
import { translate } from "@/i18n/translate"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"
import { AccountService } from "@/services/AccountService"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { Logger } from "@/utils/logger/Logger"

export async function fetchAccounts(): Promise<IAccountListItem[] | undefined> {
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
  const { isError, data, isPending } = useAppQuery<IAccountListItem[] | undefined>(
    "accounts",
    fetchAccounts,
  )
  const navigation = useNavigation()

  return (
    <GenericListScreen
      name={translate("common:balance")}
      isError={isError}
      isPending={isPending}
      props={{
        data,
        fetch: fetchAccounts,
        onPress: (id: number, name: string) => {
          navigation.getParent()?.navigate("balances", {
            screen: "transactions",
            params: { id, name, type: TransactionFieldType.Account },
          })
        },
      }}
      RightActionComponent={
        <AddButton
          onPress={() => {
            navigation.getParent()?.navigate("balances", {
              screen: "create",
            })
          }}
        />
      }
      RenderComponent={Accounts}
    />
  )
}
