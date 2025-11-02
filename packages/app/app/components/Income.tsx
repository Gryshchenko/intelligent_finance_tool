import { FC } from "react"
import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ICurrency } from "tenpercent/shared/src/interfaces/ICurrency"
import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"
import Utils from "tenpercent/shared/src/Utils"

import { EmptyState } from "@/components/EmptyState"
import { Field } from "@/components/Field"
import { GeneralDetailView } from "@/components/GeneralDetailViewю"
import { CurrencyDropdown } from "@/components/Toggle/CurrencyDropdown"
import { useInvalidateQuery } from "@/hooks/useAppQuery"
import { useEditView } from "@/hooks/useEditView"
import { translate } from "@/i18n/translate"
import AlertService from "@/services/AlertService"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { IncomeService } from "@/services/IncomeService"
import { ComponentType } from "@/types/ComponentType"

interface IIncomePros {
  data: IIncome | undefined
  type: ComponentType
}

export const Income: FC<IIncomePros> = function Incomes(_props) {
  const { data, type } = _props
  const navigation = useNavigation()
  const invalidateQuery = useInvalidateQuery()
  const { isView, form, handleChange, edit, cancel, save } = useEditView<IIncome>(data!)

  const handlePatch = async () => {
    const incomeService = IncomeService.instance()
    if (Utils.isEmpty(form.incomeName)) return
    if (Utils.isNull(form.incomeId)) return

    const response = await incomeService.doPatchIncome(form.incomeId!, {
      incomeName: form.incomeName!,
    })
    if (response.kind === GeneralApiProblemKind.Ok) {
      AlertService.info(translate("common:info"), translate("common:updateAccountSuccess"))
      invalidateQuery([["income_accounts"]])
      invalidateQuery([["income_account", form.incomeId]])
    } else {
      AlertService.error(translate("common:error"), translate("common:updateAccountFailed"))
    }
  }

  const handleDelete = async () => {
    const incomeService = IncomeService.instance()
    if (!form.incomeId) return

    const response = await incomeService.doDeleteIncome(form.incomeId)
    if (response.kind === GeneralApiProblemKind.Ok) {
      AlertService.info(translate("common:info"), translate("common:deleteAccountSuccess"))
      invalidateQuery([["income_accounts"]])
      invalidateQuery([["income_account", form.incomeId]])
    } else {
      AlertService.error(translate("common:error"), translate("common:deleteAccountFailed"))
    }
  }

  const onDelete = () => {
    AlertService.confirm(
      translate("common:deleteAccountTitle"),
      translate("common:deleteAccountMessage"),
      handleDelete,
    )
  }

  const handleSave = async () => {
    save()
    await handlePatch()
  }
  if (!data) {
    return <EmptyState style={$containerStyleOverride} buttonOnPress={() => navigation.goBack()} />
  }

  return (
    <GeneralDetailView
      isView={isView}
      onEdit={edit}
      onCancel={cancel}
      onSave={handleSave}
      onDelete={onDelete}
    >
      <view style={$fieldWrapper as undefined}>
        <Field
          style={$fieldName}
          label={translate("common:name")}
          value={String(form.incomeName)}
          editable={!isView}
          onChangeText={(v) => handleChange("incomeName", v)}
        />
        <CurrencyDropdown
          style={$fieldCurrency}
          disabled={isView}
          value={form.currencyId}
          onChange={(item: ICurrency) => handleChange("currencyId", item.currencyId)}
        />
      </view>
    </GeneralDetailView>
  )
}
const $containerStyleOverride: StyleProp<ViewStyle> = {
  margin: "auto",
}
const $fieldWrapper: StyleProp<ViewStyle> = {
  display: "flex",
  justifyContent: "space-between",
}
const $fieldName: StyleProp<TextStyle> = {
  width: "60%",
}
const $fieldCurrency: StyleProp<TextStyle> = {
  width: "38%",
}
