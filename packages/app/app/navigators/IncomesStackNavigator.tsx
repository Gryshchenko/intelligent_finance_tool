import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { TransactionFieldType } from "tenpercent/shared/src/types/TransactionFieldType"

import { IncomeCreateScreen } from "@/screens/IncomeScreens/IncomeCreateScreen"
import { IncomeEditScreen } from "@/screens/IncomeScreens/IncomeEditScreen"
import { IncomesScreen } from "@/screens/IncomeScreens/IncomesScreen"
import { IncomeViewScreen } from "@/screens/IncomeScreens/IncomeViewScreen"
import { TransactionScreen } from "@/screens/TransactionsScreen/TransactionScreen"
import { TransactionsScreen } from "@/screens/TransactionsScreen/TransactionsScreen"

const IncomesStack = createNativeStackNavigator()

export interface IncomesStackParamList {
  accounts: undefined
  transactions: { id: number; type: TransactionFieldType; name: string }
  transaction: { id: number }
  view: { id: number; name: string }
  edit: { id: number; name: string; payload: string }
  create: { payload: string }
}

function IncomesStackNavigator() {
  return (
    <IncomesStack.Navigator screenOptions={{ headerShown: false }}>
      <IncomesStack.Screen name="accounts" component={IncomesScreen} />
      <IncomesStack.Screen name="view" component={IncomeViewScreen} />
      <IncomesStack.Screen name="create" component={IncomeCreateScreen} />
      <IncomesStack.Screen name="edit" component={IncomeEditScreen} />
      <IncomesStack.Screen name="transactions" component={TransactionsScreen} />
      <IncomesStack.Screen name="transaction" component={TransactionScreen} />
    </IncomesStack.Navigator>
  )
}
export { IncomesStackNavigator }
