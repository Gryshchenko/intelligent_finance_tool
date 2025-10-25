import { TextStyle } from "react-native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"

import { ErrorState } from "@/components/ErrorState"
import { Header } from "@/components/Header"
import { Incomes } from "@/components/Incomes"
import { PendingState } from "@/components/PengingState"
import { Screen } from "@/components/Screen"
import { useAppQuery } from "@/hooks/useAppQuery"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { IncomeService } from "@/services/IncomeService"
import { $styles } from "@/theme/styles"
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

type Props = BottomTabScreenProps<OverviewTabParamList, "incomes">

export const IncomesScreen = function IncomesScreen(_props: Props) {
  const { isError, data, isPending } = useAppQuery<IIncome[]>("incomes", fetchIncomes)

  return (
    <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
      <Header
        titleTx="common:incomes"
        titleMode="flex"
        titleStyle={$rightAlignTitle}
        safeAreaEdges={[]}
      />
      {isError && <ErrorState />}
      {isPending && <PendingState />}
      {!isError && !isPending && <Incomes incomes={data} />}
    </Screen>
  )
}
const $rightAlignTitle: TextStyle = {
  textAlign: "center",
}
