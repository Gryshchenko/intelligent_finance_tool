import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ICategory } from "tenpercent/shared/src/interfaces/ICategory"
import Utils from "tenpercent/shared/src/Utils"

import { CategoryEdit } from "@/components/category/CategoryEdit"
import { OverviewTabParamList } from "@/navigators/OverviewNavigator"
import { GenericListScreen } from "@/screens/GenericListScreen"

type Props = NativeStackScreenProps<OverviewTabParamList, "edit">

export const CategoryEditScreen = function CategoryEditScreen(_props: Props) {
  const params = _props?.route?.params as { id: number; name: string; payload: string }
  const navigation = useNavigation()
  const data = Utils.parseObject<ICategory | undefined>(params.payload)
  return (
    <GenericListScreen
      name={data?.categoryName ?? ""}
      isError={false}
      isPending={false}
      onBack={() =>
        navigation.getParent()?.navigate("expenses", {
          screen: "categories",
        })
      }
      props={{
        data,
      }}
      RenderComponent={CategoryEdit}
    />
  )
}
