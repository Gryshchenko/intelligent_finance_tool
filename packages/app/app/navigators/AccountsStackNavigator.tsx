import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { AccountScreen } from "@/screens/AccountScreens/AccountScreen"
import { AccountsScreen } from "@/screens/AccountScreens/AccountsScreen"

const AccountsStack = createNativeStackNavigator()

export interface AccountStackParamList {
  Accounts: undefined
  Account: { accountId: number }
}

function AccountsStackNavigator() {
  return (
    <AccountsStack.Navigator screenOptions={{ headerShown: false }}>
      <AccountsStack.Screen name="Accounts" component={AccountsScreen} />
      <AccountsStack.Screen name="Account" component={AccountScreen} />
    </AccountsStack.Navigator>
  )
}
export { AccountsStackNavigator }
