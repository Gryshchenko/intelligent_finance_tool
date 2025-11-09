import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { TransactionCreate } from "@/components/transaction/TransactionCreate"
import { translate } from "@/i18n/translate"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"

type Props = NativeStackScreenProps<OverviewTabParamList, "create">

export const TransactionCreateScreen = function TransactionCreateScreen(_props: Props) {
  const navigation = useNavigation()
  return (
    <GenericListScreen
      name={translate("common:new")}
      isError={false}
      isPending={false}
      onBack={() =>
        navigation.getParent()?.navigate("history", {
          screen: "transactions",
        })
      }
      props={{
        data: undefined,
      }}
      RenderComponent={TransactionCreate}
    />
  )
}
