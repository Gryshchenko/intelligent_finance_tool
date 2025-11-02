import { useState } from "react"
import { View, Pressable, FlatList, Modal, ViewStyle, TextStyle, StyleProp } from "react-native"

import { Text } from "@/components/Text"
import { useAppQuery } from "@/hooks/useAppQuery"
import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

type DropdownProps<T> = {
  queryKey: string
  fetcher: () => Promise<T[] | undefined>
  value?: string | number
  onChange?: (item: T) => void
  keyExtractor: (item: T) => string
  labelExtractor: (item: T) => string
  labelTx?: TxKeyPath
  style?: StyleProp<TextStyle>
  disabled?: boolean
  filter?: (items: T[] | undefined) => T[]
}

export function Dropdown<T>({
  queryKey,
  fetcher,
  value,
  onChange,
  keyExtractor,
  labelExtractor,
  labelTx,
  style,
  disabled,
  filter,
}: DropdownProps<T>) {
  const { isError, data, isPending } = useAppQuery<T[] | undefined>(queryKey, fetcher)
  const [isOpen, setIsOpen] = useState(false)
  const { themed } = useAppTheme()

  const selected = data?.find((item) => keyExtractor(item) === String(value))
  const filteredData = filter ? filter(data) : data

  const handleSelect = (item: T) => {
    setIsOpen(false)
    onChange?.(item)
  }

  return (
    <View style={style}>
      {labelTx && <Text size={"xs"} preset="formLabel" tx={labelTx} />}
      <Pressable
        disabled={disabled || isPending || isError}
        style={themed($trigger)}
        onPress={() => setIsOpen(true)}
      >
        <Text style={themed($triggerText)}>
          {isPending
            ? `${translate("common:loading")}...`
            : isError
              ? translate("common:failedLoad")
              : selected
                ? labelExtractor(selected)
                : translate("common:selectOption")}
        </Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={themed($overlay)} onPress={() => setIsOpen(false)}>
          <View style={themed($dropdown)}>
            <FlatList
              data={filteredData || []}
              keyExtractor={(item) => keyExtractor(item) ?? "id"}
              renderItem={({ item }) => (
                <Pressable style={themed($option)} onPress={() => handleSelect(item)}>
                  <Text style={themed($optionText)}>{labelExtractor(item)}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const $trigger: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: spacing.xxs,
  backgroundColor: colors.background,
})

const $triggerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.text,
  marginVertical: 8,
  marginHorizontal: 12,
})

const $overlay: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: `${colors.background}AA`,
  justifyContent: "center",
  alignItems: "center",
})

const $dropdown: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: "80%",
  backgroundColor: colors.background,
  borderRadius: spacing.xxs,
  maxHeight: 300,
  overflow: "hidden",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 5,
})

const $option: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
})

const $optionText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 14,
})
