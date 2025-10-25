import { FC, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { IAccountListItem } from "tenpercent/shared/src/interfaces/IAccountListItem"
import { ITransaction } from "tenpercent/shared/src/interfaces/ITransaction"
import { TransactionType } from "tenpercent/shared/src/types/TransactionType"

import { AccountDropdown } from "@/components/AccountDropdown"
import { Button } from "@/components/Button"
import { CategoryDropdown } from "@/components/CateogryDropdown"
import { EmptyState } from "@/components/EmptyState"
import { DatePickerType, IgniteDatePicker } from "@/components/IgniteDatePicker"
import IgniteSwitcher from "@/components/IgniteSwitcher"
import { IncomeDropdown } from "@/components/IncomeDropdown"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useCurrency } from "@/context/CurrencyContext"
import { translate } from "@/i18n/translate"
import AlertService from "@/services/AlertService"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { TransactionsService } from "@/services/TransactionsService"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { CurrencyUtils } from "@/utils/CurrencyUtils"
import { Logger } from "@/utils/logger/Logger"

interface ITransactionPros {
  data: ITransaction | undefined
}

export const Transaction: FC<ITransactionPros> = function Transaction(_props) {
  const { data } = _props
  const { getCurrencySymbol } = useCurrency()
  const navigation = useNavigation()
  const initialMode = "view"

  const [mode, setMode] = useState<"view" | "edit">(initialMode)
  const [form, setForm] = useState<Partial<ITransaction>>(data ?? {})

  const isView = mode === "view"

  const handleChange = (key: keyof ITransaction, value: string | number) => {
    setForm((prev) => ({ ...(prev ?? {}), [key]: value }))
  }
  const handleDelete = async () => {
    try {
      const transactionService = TransactionsService.instance()
      if (!form.transactionId) {
        return
      }
      const response = await transactionService.doDeleteTransaction(form.transactionId)
      if (response.kind === GeneralApiProblemKind.Ok) {
        AlertService.info(translate("common:info"), translate("transactionScreen:deleteSuccess"))
      } else {
        AlertService.error(translate("common:error"), translate("transactionScreen:deleteFailed"))
      }
    } catch (e) {
      Logger.Of("Transaction").error(
        `Delete transaction failed due reason: ${(e as { message: string }).message}`,
      )
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
    setMode("view")
  }

  if (!data || !data?.transactionId) {
    return (
      <EmptyState
        style={$styles.containerStyleOverride}
        buttonOnPress={() => navigation.goBack()}
      />
    )
  }

  const renderInputs = () => {
    switch (form!.transactionTypeId) {
      case TransactionType.Transafer:
        return (
          <>
            <AccountDropdown
              value={form!.accountId}
              disabled={isView}
              onChange={(v) => handleChange("accountId", v.accountId)}
            />
            <AccountDropdown
              filter={(items: IAccountListItem[] | undefined) =>
                items?.filter((item) => item.accountId !== form!.accountId) ?? []
              }
              value={form!.targetAccountId}
              disabled={isView}
              onChange={(v) => handleChange("targetAccountId", v.accountId)}
            />
          </>
        )
      case TransactionType.Expense:
        return (
          <>
            <AccountDropdown
              value={form!.accountId}
              disabled={isView}
              onChange={(v) => handleChange("accountId", v.accountId)}
            />
            <CategoryDropdown
              value={form!.categoryId}
              disabled={isView}
              onChange={(v) => handleChange("categoryId", v.categoryId)}
            />
          </>
        )
      case TransactionType.Income:
        return (
          <>
            <IncomeDropdown
              value={form!.incomeId}
              disabled={isView}
              onChange={(v) => handleChange("incomeId", v.incomeId)}
            />
            <AccountDropdown
              value={form!.accountId}
              disabled={isView}
              onChange={(v) => handleChange("accountId", v.accountId)}
            />
          </>
        )
      default:
        return undefined
    }
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ gap: spacing.md, marginTop: spacing.lg }}>
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
          value={form!.transactionTypeId}
          onChange={(opt) => handleChange("transactionTypeId", opt.value as number)}
        />
        {renderInputs()}
        <Field
          label="Amount"
          value={CurrencyUtils.formatWithDelimiter(
            form!.amount!,
            getCurrencySymbol(form!.currencyId!),
          )}
          editable={!isView}
          onChangeText={(v) => handleChange("amount", v)}
        />
        <Field
          label={translate("transactionScreen:description")}
          value={form!.description!}
          editable={!isView}
          onChangeText={(v) => handleChange("description", v)}
        />
        <IgniteDatePicker
          disabled={!isView}
          mode={DatePickerType.Datetime}
          value={new Date(form!.createAt!)}
          onChange={() => null}
        />
      </ScrollView>

      <View style={{ marginTop: spacing.xl }}>
        {isView ? (
          <View style={$styles.buttons}>
            <Button text="Edit" onPress={() => setMode("edit")} />
            <Button style={$styles.deleteButton} text="Delete" onPress={onDelete} />
          </View>
        ) : (
          <View style={$styles.buttons}>
            <Button text="Cancel" onPress={() => setMode("view")} />
            <Button text="Save" onPress={handleSave} />
          </View>
        )}
      </View>
    </>
  )
}

const $styles = StyleSheet.create({
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
    justifyContent: "center",
  },
  containerStyleOverride: {
    margin: "auto",
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
})

interface FieldProps {
  label: string
  value: string
  editable?: boolean
  onChangeText?: (text: string) => void
}

const Field: React.FC<FieldProps> = ({ label, value, editable = false, onChangeText }) => {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text text={label} preset="subheading" size={"xs"} />
      <TextField value={value} editable={editable} onChangeText={onChangeText} />
    </View>
  )
}
