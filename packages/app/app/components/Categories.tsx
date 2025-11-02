import { FC } from "react"
import { StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ICategory } from "tenpercent/shared/src/interfaces/ICategory"

import CategorySectionList from "@/components/CategoriesSectionList"
import { EmptyState } from "@/components/EmptyState"

interface ICategoriesPros {
  data: ICategory[] | undefined
}

export const Categories: FC<ICategoriesPros> = function Categories(_props) {
  const { data } = _props
  const navigation = useNavigation()

  if (!data || data?.length <= 0) {
    return (
      <EmptyState
        style={$styles.containerStyleOverride}
        buttonOnPress={() => navigation.goBack()}
      />
    )
  }

  return <CategorySectionList categories={data} />
}

const $styles = StyleSheet.create({
  containerStyleOverride: {
    margin: "auto",
  },
})
