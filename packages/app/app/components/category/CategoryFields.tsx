import { FC } from "react"
import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { ICategory } from "tenpercent/shared/src/interfaces/ICategory"

import { Field } from "@/components/Field"
import { GeneralDetailView } from "@/components/GeneralDetailViewю"
import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"

interface IProps {
  form: Partial<ICategory>
  errors?: Partial<Record<keyof ICategory, TxKeyPath>>
  handleChange?: (key: string, value: string | number) => void
  isView: boolean
  isEdit: boolean
  edit?: () => void
  cancel?: () => void
  onDelete?: () => void
  handleSave?: () => void
}

export const CategoryFields: FC<IProps> = function CategoryFields(_props) {
  const { isView, form, handleChange, handleSave, edit, cancel, onDelete, errors } = _props
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
          value={String(form.categoryName)}
          helperTx={errors?.categoryName}
          status={errors?.categoryName ? "error" : undefined}
          editable={!isView}
          onChangeText={(v) => {
            if (handleChange) {
              handleChange("categoryName", v)
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
  width: "100%",
}
