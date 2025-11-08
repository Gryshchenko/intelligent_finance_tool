import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { TransactionFieldType } from "tenpercent/shared/src/types/TransactionFieldType"

import { AccountCreateScreen } from "@/screens/AccountScreens/AccountCreateScreen"
import { AccountEditScreen } from "@/screens/AccountScreens/AccountEditScreen"
import { AccountsScreen } from "@/screens/AccountScreens/AccountsScreen"
import { AccountViewScreen } from "@/screens/AccountScreens/AccountViewScreen"
import { TransactionScreen } from "@/screens/TransactionsScreen/TransactionScreen"
import { TransactionsScreen } from "@/screens/TransactionsScreen/TransactionsScreen"

const BalancesStack = createNativeStackNavigator()

export interface BalanceStackParamList {
  accounts: undefined
  transactions: { id: number; type: TransactionFieldType; name: string }
  transaction: { id: number }
  view: { id: number; name: string }
  edit: { id: number; name: string; payload: string }
  create: { payload: string }
}

function BalancesStackNavigator() {
  return (
    <BalancesStack.Navigator screenOptions={{ headerShown: false }}>
      <BalancesStack.Screen name="accounts" component={AccountsScreen} />
      <BalancesStack.Screen name="transactions" component={TransactionsScreen} />
      <BalancesStack.Screen name="transaction" component={TransactionScreen} />
      <BalancesStack.Screen name="view" component={AccountViewScreen} />
      <BalancesStack.Screen name="create" component={AccountCreateScreen} />
      <BalancesStack.Screen name="edit" component={AccountEditScreen} />
    </BalancesStack.Navigator>
  )
}
export { BalancesStackNavigator }
