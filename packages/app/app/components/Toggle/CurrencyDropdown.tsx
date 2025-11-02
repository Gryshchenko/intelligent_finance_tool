import { StyleProp, TextStyle } from "react-native"
import { ICurrency } from "tenpercent/shared/src/interfaces/ICurrency"

import { Dropdown } from "@/components/Dropdown"
import { fetchCurrencies } from "@/context/CurrencyContext"

type CurrencyDropdownProps = {
  value?: number
  onChange?: (item: ICurrency) => void
  style?: StyleProp<TextStyle>
  disabled?: boolean
  filter?: (items: ICurrency[] | undefined) => ICurrency[]
}

export const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  value,
  onChange,
  style,
  disabled,
  filter,
}) => {
  return (
    <Dropdown
      style={style}
      onChange={onChange}
      value={value}
      labelTx={"common:currency"}
      disabled={disabled}
      queryKey={"accounts"}
      fetcher={fetchCurrencies}
      filter={filter}
      keyExtractor={(item: ICurrency) => {
        return String(item.currencyId)
      }}
      labelExtractor={(item: ICurrency) => `${item.currencyName} - ${item.symbol}`}
    />
  )
}
