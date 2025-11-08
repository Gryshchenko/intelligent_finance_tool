import { StyleProp, TextStyle, View } from "react-native"

import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { TxKeyPath } from "@/i18n"
import { spacing } from "@/theme/spacing"

interface FieldProps {
  label: string
  value: string
  editable?: boolean
  onChangeText?: (text: string) => void
  style?: StyleProp<TextStyle>
  helperTx?: TxKeyPath
  status?: "error" | "disabled"
}

export const Field: React.FC<FieldProps> = ({
  label,
  value,
  editable = false,
  onChangeText,
  style,
  helperTx,
  status,
}) => {
  return (
    <View style={[$wrapper, style]}>
      <Text text={label} preset="subheading" size={"xs"} />
      <TextField
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        helperTx={helperTx}
        status={status}
      />
    </View>
  )
}

const $wrapper: StyleProp<TextStyle> = {
  marginBottom: spacing.md,
}
