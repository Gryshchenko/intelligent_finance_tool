import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { TransactionFieldType } from "tenpercent/shared/src/types/TransactionFieldType"

import { CategoriesScreen } from "@/screens/CategoryScreens/CategoriesScreen"
import { CategoryCreateScreen } from "@/screens/CategoryScreens/CategoryCreateScreen"
import { CategoryEditScreen } from "@/screens/CategoryScreens/CategoryEditScreen"
import { CategoryViewScreen } from "@/screens/CategoryScreens/CategoryViewScreen"
import { TransactionScreen } from "@/screens/TransactionsScreen/TransactionScreen"
import { TransactionsScreen } from "@/screens/TransactionsScreen/TransactionsScreen"

const CategoriesStack = createNativeStackNavigator()

export interface CategoriesStackParamList {
  categories: undefined
  transactions: { id: number; type: TransactionFieldType; name: string }
  transaction: { id: number }
  view: { id: number; name: string }
  edit: { id: number; name: string; payload: string }
  create: { payload: string }
}

function CategoriesStackNavigator() {
  return (
    <CategoriesStack.Navigator screenOptions={{ headerShown: false }}>
      <CategoriesStack.Screen name="categories" component={CategoriesScreen} />
      <CategoriesStack.Screen name="view" component={CategoryViewScreen} />
      <CategoriesStack.Screen name="create" component={CategoryCreateScreen} />
      <CategoriesStack.Screen name="edit" component={CategoryEditScreen} />
      <CategoriesStack.Screen name="transactions" component={TransactionsScreen} />
      <CategoriesStack.Screen name="transaction" component={TransactionScreen} />
    </CategoriesStack.Navigator>
  )
}
export { CategoriesStackNavigator }
