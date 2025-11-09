import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { HistoryTransactionsScreen } from "@/screens/HistoryScreen/HistoryTransactionsScreen"
import { TransactionCreateScreen } from "@/screens/HistoryScreen/TransactionCreateScreen"
import { TransactionEditScreen } from "@/screens/HistoryScreen/TransactionEditScreen"
import { TransactionViewScreen } from "@/screens/HistoryScreen/TransactionViewScreen"

const BalancesStack = createNativeStackNavigator()

export interface HistoryStackParamList {
  transactions: undefined
  transaction: { id: number }
}

function HistoryStackNavigator() {
  return (
    <BalancesStack.Navigator screenOptions={{ headerShown: false }}>
      <BalancesStack.Screen name="transactions" component={HistoryTransactionsScreen} />
      <BalancesStack.Screen name="view" component={TransactionViewScreen} />
      <BalancesStack.Screen name="create" component={TransactionCreateScreen} />
      <BalancesStack.Screen name="edit" component={TransactionEditScreen} />
    </BalancesStack.Navigator>
  )
}
export { HistoryStackNavigator }
