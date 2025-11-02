import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { HistoryTransactionScreen } from "@/screens/HistoryScreen/HistoryTransactionScreen"
import { HistoryTransactionsScreen } from "@/screens/HistoryScreen/HistoryTransactionsScreen"

const BalancesStack = createNativeStackNavigator()

export interface HistoryStackParamList {
  transactions: undefined
  transaction: { id: number }
}

function HistoryStackNavigator() {
  return (
    <BalancesStack.Navigator screenOptions={{ headerShown: false }}>
      <BalancesStack.Screen name="transactions" component={HistoryTransactionsScreen} />
      <BalancesStack.Screen name="transaction" component={HistoryTransactionScreen} />
    </BalancesStack.Navigator>
  )
}
export { HistoryStackNavigator }
