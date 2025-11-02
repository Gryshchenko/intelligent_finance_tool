import { FC } from "react"
import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { ICurrency } from "tenpercent/shared/src/interfaces/ICurrency"
import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"

import { Field } from "@/components/Field"
import { GeneralDetailView } from "@/components/GeneralDetailViewю"
import { CurrencyDropdown } from "@/components/Toggle/CurrencyDropdown"
import { translate } from "@/i18n/translate"

interface IProps {
  form: Partial<IIncome>
  handleChange?: <K extends keyof T>(key: K, value: T[K]) => void
  isView: boolean
  edit?: () => void
  cancel?: () => void
  onDelete?: () => void
  handleSave?: () => void
}

export const IncomeFields: FC<IProps> = function IncomeFields(_props) {
  const { isView, form, handleChange, handleSave, edit, cancel, onDelete } = _props
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
          onChangeText={(v) => {
            if (handleChange) {
              handleChange("incomeName", v)
            }
          }}
        />
        <CurrencyDropdown
          style={$fieldCurrency}
          disabled={isView}
          value={form.currencyId}
          onChange={(item: ICurrency) => {
            if (handleChange) {
              handleChange("currencyId", item.currencyId)
            }
          }}
        />
      </view>
    </GeneralDetailView>
  )
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
