import { FC } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ITransaction } from "tenpercent/shared/src/interfaces/ITransaction"
import Utils from "tenpercent/shared/src/Utils"

import { EmptyState } from "@/components/EmptyState"
import { TransactionFields } from "@/components/transaction/TransactionFields"
import { useInvalidateQuery } from "@/hooks/useAppQuery"
import { useEditView } from "@/hooks/useEditView"
import { translate } from "@/i18n/translate"
import AlertService from "@/services/AlertService"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { TransactionService } from "@/services/TransactionService"

interface ITransactionPros {
  data: ITransaction | undefined
}

export const TransactionView: FC<ITransactionPros> = function TransactionView(_props) {
  const { data } = _props
  const navigation = useNavigation()
  const invalidateQuery = useInvalidateQuery()
  const { form } = useEditView<ITransaction>(data!)

  const handleDelete = async () => {
    const transactionService = TransactionService.instance()
    if (!form.transactionId) return

    const response = await transactionService.doDeleteTransaction(form.transactionId)
    if (response.kind === GeneralApiProblemKind.Ok) {
      AlertService.info(translate("common:info"), translate("transactionScreen:deleteSuccess"))
      invalidateQuery([["transactions"]])
      invalidateQuery([["transaction", form.transactionId]])
    } else {
      AlertService.error(translate("common:error"), translate("transactionScreen:deleteFailed"))
    }
  }

  const onDelete = () => {
    AlertService.confirm(
      translate("transactionScreen:deleteTitle"),
      translate("transactionScreen:deleteMessage"),
      handleDelete,
    )
  }

  if (!data) {
    return <EmptyState style={$containerStyleOverride} buttonOnPress={() => navigation.goBack()} />
  }

  return (
    <TransactionFields
      form={form}
      isView={true}
      isEdit={false}
      edit={() => {
        // navigation.getParent()?.navigate("history", {
        //   screen: "edit",
        //   params: {
        //     id: form.incomeId,
        //     name: form.incomeName,
        //     payload: Utils.objectToString(form),
        //   },
        // })
      }}
      onDelete={onDelete}
    />
  )
}
const $containerStyleOverride: StyleProp<ViewStyle> = {
  margin: "auto",
}
