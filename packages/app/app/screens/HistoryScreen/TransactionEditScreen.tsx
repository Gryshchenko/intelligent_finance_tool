import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ITransaction } from "tenpercent/shared/src/interfaces/ITransaction"
import Utils from "tenpercent/shared/src/Utils"

import { TransactionEdit } from "@/components/transaction/TransactionEdit"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"

type Props = NativeStackScreenProps<OverviewTabParamList, "edit">

export const TransactionEditScreen = function TransactionEditScreen(_props: Props) {
  const params = _props?.route?.params as { id: number; name: string; payload: string }
  const navigation = useNavigation()
  const data = Utils.parseObject<ITransaction | undefined>(params.payload)
  return (
    <GenericListScreen
      name={params?.name}
      isError={false}
      isPending={false}
      onBack={() =>
        navigation.getParent()?.navigate("history", {
          screen: "transactions",
        })
      }
      props={{
        data,
      }}
      RenderComponent={TransactionEdit}
    />
  )
}
