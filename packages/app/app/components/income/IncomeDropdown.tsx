import { ViewStyle } from "react-native"
import { IIncome } from "tenpercent/shared/src/interfaces/IIncome"

import { Dropdown } from "@/components/Dropdown"
import { fetchIncomes } from "@/screens/IncomeScreens/IncomesScreen"

type IncomeDropdownProps = {
  value?: number
  onChange?: (item: IIncome) => void
  style?: ViewStyle
  disabled?: boolean
}

export const IncomeDropdown: React.FC<IncomeDropdownProps> = ({
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
      labelTx={"common:incomes"}
      disabled={disabled}
      queryKey={"incomes"}
      fetcher={fetchIncomes}
      keyExtractor={(item: IIncome) => {
        return String(item.incomeId)
      }}
      labelExtractor={(item: IIncome) => item.incomeName}
    />
  )
}
