import { useState } from "react"
import { View, Pressable, Modal, ViewStyle, TextStyle, StyleProp } from "react-native"

import { ListItem } from "@/components/ListItem"
import { Text, TextProps } from "@/components/Text"
import { useAppQuery } from "@/hooks/useAppQuery"
import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import SectionListWithKeyboardAwareScrollView from "@/screens/DemoShowroomScreen/SectionListWithKeyboardAwareScrollView"
import { colors } from "@/theme/colors"
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
  helperTx?: TxKeyPath
  helper?: string
  HelperTextProps?: TextProps
  status?: "error" | "disabled"
  helperTxOptions?: TextProps["txOptions"]
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
  HelperTextProps,
  status,
  helper,
  helperTx,
  helperTxOptions,
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

  const $helperStyles = [
    $helperStyle,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]
  const $inputWrapperStyles = [status === "error" && { borderColor: colors.error }]

  const renderItem = ({ item: transaction }: { item: T }) => {
    if (!transaction) return null

    return (
      <ListItem
        key={keyExtractor(transaction)}
        disabled={false}
        bottomSeparator
        onPress={() => handleSelect(transaction)}
      >
        <View style={themed([$option])}>
          <Text style={themed([$optionText])}>{labelExtractor(transaction)}</Text>
        </View>
      </ListItem>
    )
  }

  const sections = [
    {
      name: "",
      description: "",
      data: filteredData ?? [],
    },
  ]
  return (
    <View style={style}>
      {labelTx && <Text size={"xs"} preset="formLabel" tx={labelTx} />}
      <Pressable
        disabled={disabled || isPending || isError}
        style={[themed($trigger), themed($inputWrapperStyles)]}
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

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={themed($overlay)} onPress={() => setIsOpen(false)}>
          <View style={themed($dropdown)}>
            <SectionListWithKeyboardAwareScrollView
              sections={sections}
              keyExtractor={(item) => keyExtractor(item) ?? "id"}
              renderItem={renderItem}
              stickySectionHeadersEnabled={true}
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
  width: "100%",
  height: "90%",
  marginTop: "auto",
  backgroundColor: colors.background,
  borderRadius: spacing.xxs,
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
const $helperStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
