import { ViewStyle } from "react-native"
import { ICategory } from "tenpercent/shared/src/interfaces/ICategory"

import { Dropdown } from "@/components/Dropdown"
import { fetchCategories } from "@/screens/CategoryScreens/CategoriesScreen"

type CategoryDropdownProps = {
  value?: number
  onChange?: (item: ICategory) => void
  style?: ViewStyle
  disabled?: boolean
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
  style,
  disabled,
}) => {
  return (
    <Dropdown
      style={style}
      onChange={onChange}
      value={value}
      labelTx={"common:expenses"}
      disabled={disabled}
      queryKey={"categories"}
      fetcher={fetchCategories}
      keyExtractor={(item: ICategory) => {
        return String(item.categoryId)
      }}
      labelExtractor={(item: ICategory) => item.categoryName}
    />
  )
}
