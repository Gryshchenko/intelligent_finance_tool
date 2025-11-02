import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"

import { AddButton } from "@/components/AddButton"
import { Incomes } from "@/components/Incomes"
import { useAppQuery } from "@/hooks/useAppQuery"
import { translate } from "@/i18n/translate"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { IncomeService } from "@/services/IncomeService"
import { Logger } from "@/utils/logger/Logger"

export async function fetchIncomes(): Promise<IIncome[]> {
  try {
    const incomeService = IncomeService.instance()
    const response = await incomeService.doGetIncomes()
    switch (response.kind) {
      case GeneralApiProblemKind.Ok: {
        return response.data as IIncome[]
      }
      default: {
        return []
      }
    }
  } catch (e) {
    Logger.Of("FetchIncomes").error(
      `Fetch income failed due reason: ${(e as { message: string }).message}`,
    )
    return []
  }
}

type Props = NativeStackScreenProps<OverviewTabParamList, "accounts">

export const IncomesScreen = function IncomesScreen(_props: Props) {
  const navigator = useNavigation()
  const { isError, data, isPending } = useAppQuery<IIncome[] | undefined>(
    "income_accounts",
    fetchIncomes,
  )

  return (
    <GenericListScreen
      name={translate("common:incomes")}
      isError={isError}
      isPending={isPending}
      props={{
        data,
        fetch: fetchIncomes,
      }}
      RightActionComponent={
        <AddButton
          onPress={() => {
            navigator.getParent()?.navigate("incomes", {
              screen: "create",
            })
          }}
        />
      }
      RenderComponent={Incomes}
    />
  )
}
