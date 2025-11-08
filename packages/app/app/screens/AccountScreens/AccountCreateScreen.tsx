import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { AccountCreate } from "@/components/account/AccountCreate"
import { translate } from "@/i18n/translate"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"

type Props = NativeStackScreenProps<OverviewTabParamList, "create">

export const AccountCreateScreen = function AccountCreateScreen(_props: Props) {
  const navigation = useNavigation()
  return (
    <GenericListScreen
      name={translate("common:new")}
      isError={false}
      isPending={false}
      onBack={() =>
        navigation.getParent()?.navigate("balances", {
          screen: "accounts",
        })
      }
      props={{
        data: undefined,
      }}
      RenderComponent={AccountCreate}
    />
  )
}
