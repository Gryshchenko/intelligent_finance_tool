import { FC } from "react"
import { StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ITransaction } from "tenpercent/shared/src/interfaces/ITransaction"
import { TransactionType } from "tenpercent/shared/src/types/TransactionType"

import { AccountDropdown } from "@/components/account/AccountDropdown"
import { CategoryDropdown } from "@/components/category/CateogryDropdown"
import { EmptyState } from "@/components/EmptyState"
import { Field } from "@/components/Field"
import { GeneralDetailView } from "@/components/GeneralDetailViewю"
import { DatePickerType, IgniteDatePicker } from "@/components/IgniteDatePicker"
import IgniteSwitcher from "@/components/IgniteSwitcher"
import { IncomeDropdown } from "@/components/income/IncomeDropdown"
import { useCurrency } from "@/context/CurrencyContext"
import { useInvalidateQuery } from "@/hooks/useAppQuery"
import { useEditView } from "@/hooks/useEditView"
import { translate } from "@/i18n/translate"
import AlertService from "@/services/AlertService"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { TransactionsService } from "@/services/TransactionsService"
import { CurrencyUtils } from "@/utils/CurrencyUtils"

interface ITransactionPros {
  data: ITransaction | undefined
}

export const Transaction: FC<ITransactionPros> = function Transaction(_props) {
  const { data } = _props
  const { getCurrencySymbol } = useCurrency()
  const navigation = useNavigation()
  const invalidateQuery = useInvalidateQuery()

  const { isView, form, handleChange, edit, cancel, save } = useEditView<ITransaction>(data!)

  const handleDelete = async () => {
    const transactionService = TransactionsService.instance()
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

  const handleSave = () => {
    save()
  }

  if (!data?.transactionId) {
    return (
      <EmptyState
        style={$styles.containerStyleOverride}
        buttonOnPress={() => navigation.goBack()}
      />
    )
  }

  const renderInputs = () => {
    switch (form.transactionTypeId) {
      case TransactionType.Transafer:
        return (
          <>
            <AccountDropdown
              value={form.accountId}
              disabled={isView}
              onChange={(v) => handleChange("accountId", v.accountId)}
            />
            <AccountDropdown
              value={form.targetAccountId}
              disabled={isView}
              onChange={(v) => handleChange("targetAccountId", v.accountId)}
            />
          </>
        )
      case TransactionType.Expense:
        return (
          <>
            <AccountDropdown
              value={form.accountId}
              disabled={isView}
              onChange={(v) => handleChange("accountId", v.accountId)}
            />
            <CategoryDropdown
              value={form.categoryId}
              disabled={isView}
              onChange={(v) => handleChange("categoryId", v.categoryId)}
            />
          </>
        )
      case TransactionType.Income:
        return (
          <>
            <IncomeDropdown
              value={form.incomeId}
              disabled={isView}
              onChange={(v) => handleChange("incomeId", v.incomeId)}
            />
            <AccountDropdown
              value={form.accountId}
              disabled={isView}
              onChange={(v) => handleChange("accountId", v.accountId)}
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <GeneralDetailView
      isView={isView}
      onEdit={edit}
      onCancel={cancel}
      onSave={handleSave}
      onDelete={onDelete}
    >
      <IgniteSwitcher
        disabled={isView}
        options={[
          {
            id: TransactionType.Income,
            label: translate("common:incomes"),
            value: TransactionType.Income,
          },
          {
            id: TransactionType.Expense,
            label: translate("common:expenses"),
            value: TransactionType.Expense,
          },
          {
            id: TransactionType.Transafer,
            label: translate("common:transfer"),
            value: TransactionType.Transafer,
          },
        ]}
        value={form.transactionTypeId}
        onChange={(opt) => handleChange("transactionTypeId", opt.value as number)}
      />

      {renderInputs()}

      <Field
        label="Amount"
        value={CurrencyUtils.formatWithDelimiter(form.amount!, getCurrencySymbol(form.currencyId!))}
        editable={!isView}
        onChangeText={(v) => handleChange("amount", Number(v))}
      />

      <Field
        label={translate("transactionScreen:description")}
        value={form.description!}
        editable={!isView}
        onChangeText={(v) => handleChange("description", v)}
      />

      <IgniteDatePicker
        disabled={isView}
        mode={DatePickerType.Datetime}
        value={new Date(form.createAt!)}
        onChange={() => null}
      />
    </GeneralDetailView>
  )
}

const $styles = StyleSheet.create({
  containerStyleOverride: {
    margin: "auto",
  },
})
