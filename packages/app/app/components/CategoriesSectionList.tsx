import { forwardRef } from "react"
import { SectionList, View } from "react-native"
import { ViewStyle, TextStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ICategory } from "tenpercent/shared/src/interfaces/ICategory"
import Utils from "tenpercent/shared/src/Utils"

import { EmptyState } from "@/components/EmptyState"
import { Text } from "@/components/Text"
import { useCurrency } from "@/context/CurrencyContext"
import SectionListWithKeyboardAwareScrollView from "@/screens/DemoShowroomScreen/SectionListWithKeyboardAwareScrollView"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { CurrencyUtils } from "@/utils/CurrencyUtils"

import { ListItem } from "./ListItem"

interface Props {
  categories: ICategory[]
}

const CategorySectionList = forwardRef<SectionList<ICategory>, Props>(({ categories }, ref) => {
  const navigation = useNavigation()
  const { themed } = useAppTheme()
  const { getCurrencySymbol } = useCurrency()

  if (!categories || categories?.length <= 0) {
    return (
      <EmptyState
        style={themed([$containerStyleOverride])}
        buttonOnPress={() => navigation.goBack()}
      />
    )
  }
  const sections = [
    {
      name: "",
      description: "",
      data: categories,
    },
  ]

  const renderItem = ({ item: transaction }: { item: ICategory }) => {
    if (!transaction) return null
    const { categoryName, currencyId } = transaction

    return (
      <ListItem
        key={currencyId}
        disabled={!Utils.isNumber(currencyId as unknown as string)}
        bottomSeparator
        onPress={() => null}
        RightComponent={
          <Text style={themed([$center])}>
            {CurrencyUtils.formatWithDelimiter(0, getCurrencySymbol(currencyId))}
          </Text>
        }
      >
        <View style={themed([$leftContainer])}>
          <Text style={themed([$typeLabel])}>{categoryName}</Text>
        </View>
      </ListItem>
    )
  }

  return (
    <SectionListWithKeyboardAwareScrollView
      ref={ref}
      sections={sections}
      keyExtractor={(item: ICategory) => String(item.categoryId)}
      renderItem={renderItem}
      stickySectionHeadersEnabled={true}
      renderSectionHeader={({ section }) => {
        return <Text style={themed([$header])}>{section.name}</Text>
      }}
    />
  )
})

export default CategorySectionList

export const $center: ThemedStyle<ViewStyle> = () => ({
  alignContent: "center",
  alignItems: "center",
  display: "flex",
  height: "100%",
})

export const $containerStyleOverride: ThemedStyle<ViewStyle> = () => ({
  margin: "auto",
})

export const $description: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 13,
  color: theme.colors.textDim,
})

export const $flowText: ThemedStyle<TextStyle> = () => ({
  fontSize: 13,
  lineHeight: 18,
})

export const $header: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  display: "flex",
  justifyContent: "center",
  paddingBottom: 10,
  paddingTop: 10,
})

export const $leftContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "column",
})

export const $typeLabel: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 2,
  color: theme.colors.text,
})
