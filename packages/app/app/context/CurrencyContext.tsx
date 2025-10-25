import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react"
import { ICurrency } from "tenpercent/shared/src/interfaces/ICurrency"
import Utils from "tenpercent/shared/src/Utils"

import { buildGeneralApiBaseHandler, GeneralApiProblemKind } from "@/services/api/apiProblem"
import { CurrencyService } from "@/services/CurrencyService"
import { ValidationError } from "@/utils/errors/ValidationError"
import { Logger } from "@/utils/logger/Logger"

export interface CurrencyContextType {
  getCurrency: (currencyId: number) => ICurrency | undefined
  getCurrencySymbol: (currencyId: number) => string
}

export const CurrencyContext = createContext<CurrencyContextType | null>(null)

export interface CurrencyProviderProps {}

const _logger = Logger.Of("CurrencyContext")

export const CurrencyProvider: FC<PropsWithChildren<CurrencyProviderProps>> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Map<number, ICurrency>>(new Map())
  const getDefaultCurrency = (): ICurrency => {
    return {
      currencyId: -1,
      currencyCode: "UNK",
      currencyName: "UNK",
      symbol: "UNK",
    }
  }
  const getCurrency = (currencyId: number): ICurrency | undefined => {
    if (Utils.isNull(currencyId)) return undefined
    if (!currencies.has(currencyId)) return getDefaultCurrency()
    return currencies.get(currencyId)
  }
  const getCurrencySymbol = (currencyId: number): string => {
    if (Utils.isNull(currencyId)) return getDefaultCurrency().symbol
    if (!currencies.has(currencyId)) return getDefaultCurrency().symbol
    return currencies.get(currencyId)?.symbol ?? getDefaultCurrency().symbol
  }
  const value = {
    getCurrency,
    getCurrencySymbol,
  }

  useEffect(() => {
    ;(async () => {
      try {
        const currencyService = new CurrencyService()
        const response = await currencyService.doGetCurrencies()
        switch (response.kind) {
          case GeneralApiProblemKind.Ok: {
            const data = response.data as ICurrency[]
            const result: Map<number, ICurrency> = new Map()
            data?.forEach((currency) => {
              result.set(currency.currencyId, currency)
            })
            setCurrencies(result)
            break
          }
          case GeneralApiProblemKind.BadData:
          case GeneralApiProblemKind.Unauthorized:
          case GeneralApiProblemKind.Forbidden: {
            throw new ValidationError({
              message: JSON.stringify(response.errors),
            })
            break
          }
          default: {
            buildGeneralApiBaseHandler(response)
          }
        }
      } catch (e) {
        _logger.error("Currency context failed due reason: ", (e as { message: string }).message)
      }
    })()
  }, [])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error("useCurrency must be used within an CurrencyProvider")
  return context
}
