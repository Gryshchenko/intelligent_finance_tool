import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { IncomeCreateScreen } from "@/screens/IncomeScreens/IncomeCreateScreen"
import { IncomeEditScreen } from "@/screens/IncomeScreens/IncomeEditScreen"
import { IncomesScreen } from "@/screens/IncomeScreens/IncomesScreen"
import { IncomeViewScreen } from "@/screens/IncomeScreens/IncomeViewScreen"

const IncomesStack = createNativeStackNavigator()

export interface IncomesStackParamList {
  accounts: undefined
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
    </IncomesStack.Navigator>
  )
}
export { IncomesStackNavigator }
