import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { TransactionFieldType } from "tenpercent/shared/src/types/TransactionFieldType"

import { AccountsScreen } from "@/screens/AccountScreens/AccountsScreen"
import { TransactionScreen } from "@/screens/TransactionsScreen/TransactionScreen"
import { TransactionsScreen } from "@/screens/TransactionsScreen/TransactionsScreen"

const BalancesStack = createNativeStackNavigator()

export interface BalanceStackParamList {
  accounts: undefined
  transactions: { id: number; type: TransactionFieldType; name: string }
  transaction: { id: number }
}

function BalancesStackNavigator() {
  return (
    <BalancesStack.Navigator screenOptions={{ headerShown: false }}>
      <BalancesStack.Screen name="accounts" component={AccountsScreen} />
      <BalancesStack.Screen name="transactions" component={TransactionsScreen} />
      <BalancesStack.Screen name="transaction" component={TransactionScreen} />
    </BalancesStack.Navigator>
  )
}
export { BalancesStackNavigator }
