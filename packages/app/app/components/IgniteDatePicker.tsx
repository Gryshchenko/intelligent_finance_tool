import { useState } from "react"
import { View, Pressable, Platform, ViewStyle, TextStyle } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"

import { Text, TextProps } from "@/components/Text"
import { TxKeyPath } from "@/i18n"
import { colors } from "@/theme/colors"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

export enum DatePickerType {
  Date = "date",
  Time = "time",
  Datetime = "datetime",
}

type IgniteDatePickerProps = {
  value: Date | null
  onChange: (date: Date) => void
  placeholder?: string
  mode?: DatePickerType
  minimumDate?: Date
  maximumDate?: Date
  style?: ViewStyle
  disabled?: boolean
  helperTx?: TxKeyPath
  status?: "error" | "disabled"
  HelperTextProps?: TextProps
  helper?: string
  helperTxOptions?: TextProps["txOptions"]
}

export const IgniteDatePicker: React.FC<IgniteDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  mode = "date",
  minimumDate = new Date(2000, 0, 1),
  maximumDate = new Date(2030, 11, 31),
  disabled,
  style,
  helperTx,
  status,
  HelperTextProps,
  helper,
  helperTxOptions,
}) => {
  const { themed } = useAppTheme()
  const [show, setShow] = useState(false)

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios")
    if (selectedDate) onChange(selectedDate)
  }

  const $helperStyles = [
    $helperStyle,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]
  const formattedDate = value ? value.toLocaleDateString() : placeholder

  return (
    <View style={style}>
      <Text preset="formLabel" tx={"common:date"} />
      <Pressable disabled={disabled} style={themed($input)} onPress={() => setShow(true)}>
        <Text style={themed($text)}>{formattedDate}</Text>
      </Pressable>
      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={themed($helperStyles)}
        />
      )}

      {show && (
        <DateTimePicker
          disabled={disabled}
          value={value || new Date()}
          mode={mode === "datetime" ? "date" : mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  )
}

const $input: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: spacing.xxs,
  backgroundColor: colors.background,
})

const $text: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.text,
  marginVertical: 8,
  marginHorizontal: 12,
})
const $helperStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
