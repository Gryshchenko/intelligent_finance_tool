import * as Yup from "yup"

const translationsKeys = {
  valueRequired: "validation:valueRequired",
  valueTooShort: "validation:valueTooShort",
  valueTooLong: "validation:valueTooLong",
  valueInvalidRange: "validation:valueInvalidRange",
}

const incomeEdit = {
  incomeName: Yup.string()
    .required(translationsKeys.valueRequired)
    .min(3, translationsKeys.valueTooShort)
    .max(50, translationsKeys.valueTooLong),
  currencyId: Yup.number()
    .min(Number.MIN_VALUE, translationsKeys.valueTooShort)
    .max(Number.MIN_VALUE, translationsKeys.valueTooLong),
}

const accountEdit = {
  amount: Yup.number()
    .min(Number.MIN_VALUE, translationsKeys.valueTooShort)
    .max(Number.MIN_VALUE, translationsKeys.valueTooLong),
  accountName: Yup.string()
    .required(translationsKeys.valueRequired)
    .min(3, translationsKeys.valueTooShort)
    .max(50, translationsKeys.valueTooLong),
  currencyId: Yup.number()
    .min(Number.MIN_VALUE, translationsKeys.valueTooShort)
    .max(Number.MIN_VALUE, translationsKeys.valueTooLong),
}
const categoryEdit = {
  categoryName: Yup.string()
    .required(translationsKeys.valueRequired)
    .min(3, translationsKeys.valueTooShort)
    .max(50, translationsKeys.valueTooLong),
  currencyId: Yup.number()
    .min(Number.MIN_VALUE, translationsKeys.valueTooShort)
    .max(Number.MIN_VALUE, translationsKeys.valueTooLong),
}

const incomeCreateSchema = Yup.object(incomeEdit)
const incomeEditSchema = Yup.object(incomeEdit)

const accountCreateSchema = Yup.object(accountEdit)
const accountEditSchema = Yup.object(accountEdit)

const categoryCreateSchema = Yup.object(categoryEdit)
const categoryEditSchema = Yup.object(categoryEdit)

export {
  incomeEditSchema,
  incomeCreateSchema,
  accountEditSchema,
  accountCreateSchema,
  categoryEditSchema,
  categoryCreateSchema,
}
