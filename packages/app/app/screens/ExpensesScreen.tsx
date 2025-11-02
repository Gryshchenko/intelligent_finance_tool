import { FC } from "react"
import { ICategory } from "tenpercent/shared/src/interfaces/ICategory"

import { Categories } from "@/components/Categories"
import { useAppQuery } from "@/hooks/useAppQuery"
import { translate } from "@/i18n/translate"
import { MainTabScreenProps } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { CategoriesService } from "@/services/CategoriesService"
import { Logger } from "@/utils/logger/Logger"

export async function fetchCategories(): Promise<ICategory[]> {
  try {
    const categoriesService = CategoriesService.instance()
    const response = await categoriesService.doGetCategories()
    switch (response.kind) {
      case GeneralApiProblemKind.Ok: {
        return response.data as ICategory[]
      }
      default: {
        return []
      }
    }
  } catch (e) {
    Logger.Of("FetchCategories").error(
      `Fetch categories failed due reason: ${(e as { message: string }).message}`,
    )
    return []
  }
}

export const ExpensesScreen: FC<MainTabScreenProps<"expenses">> = function ExpensesScreen(_props) {
  const { isError, data, isPending } = useAppQuery<ICategory[] | undefined>(
    ["categories"],
    async () => fetchCategories(),
  )

  return (
    <GenericListScreen
      name={translate("common:expenses")}
      isError={isError}
      isPending={isPending}
      props={{
        data,
      }}
      RenderComponent={Categories}
    />
  )
}
