import { FC } from "react"
import { useNavigation } from "@react-navigation/native"
import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"
import Utils from "tenpercent/shared/src/Utils"

import { IncomeFields } from "@/components/IncomeFields"
import { useEditView } from "@/hooks/useEditView"
import { translate } from "@/i18n/translate"
import AlertService from "@/services/AlertService"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { IncomeService } from "@/services/IncomeService"

export const IncomeCreate: FC = function IncomeCreate(_props) {
  const navigation = useNavigation()
  const { form, handleChange, save } = useEditView<Partial<IIncome>>({
    incomeName: "",
    currencyId: 1,
  })

  const handleCreate = async () => {
    const incomeService = IncomeService.instance()
    if (Utils.isEmpty(form.incomeName)) return
    if (Utils.isNull(form.currencyId)) return

    const response = await incomeService.doCreateIncome({
      incomeName: form.incomeName!,
      currencyId: form.currencyId!,
    })
    if (response.kind === GeneralApiProblemKind.Ok) {
      AlertService.info(translate("common:info"), translate("common:createAccountSuccess"))
      navigation.getParent()?.navigate("incomes", {
        screen: "accounts",
      })
    } else {
      AlertService.error(translate("common:error"), translate("common:createAccountFailed"))
    }
  }

  const handleSave = async () => {
    save()
    await handleCreate()
  }

  return (
    <IncomeFields
      form={form}
      isView={false}
      handleChange={handleChange}
      cancel={() => {
        navigation.getParent()?.navigate("incomes", {
          screen: "view",
          params: { id: form.incomeId, name: form.incomeName },
        })
      }}
      handleSave={handleSave}
    />
  )
}
