import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import * as Keychain from "react-native-keychain"
import { useMMKVString } from "react-native-mmkv"
import { IUserClient } from "tenpercent/shared/src/interfaces/IUserClient"

import { TxKeyPath } from "@/i18n"

import { ValidationTypes } from "../../types/ValidationTypes"

export interface AuthContextType {
  isAuthenticated: boolean
  isUserConfirmed: boolean
  authEmail?: string
  setAuthToken: (token?: string) => Promise<void>
  setAuthEmail: (email: string) => void
  logout: () => Promise<void>
  validationError: TxKeyPath
  authProfile: IUserClient | null
  doAuth: (profile: IUserClient, token: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isUserConfirmed, setIsUserConfirmed] = useState<boolean>(false)
  const [authEmail, setAuthEmail] = useMMKVString("AuthProvider.authEmail")
  const [authProfile, setAuthProfile] = useMMKVString("AuthProvider.authProfile")

  useEffect(() => {
    ;(async () => {
      const credentials = await Keychain.getGenericPassword({ service: "com.tenpercent.token" })
      if (credentials) {
        setIsAuthenticated(false)
      }
    })()
  }, [])

  const setAuthToken = useCallback(async (token?: string) => {
    if (!token) {
      await Keychain.resetGenericPassword({ service: "com.tenpercent.token" })
      setIsAuthenticated(false)
    } else {
      await Keychain.setGenericPassword("auth", token, {
        service: "com.tenpercent.token",
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      })
      setIsAuthenticated(true)
    }
  }, [])

  const logout = useCallback(async () => {
    await setAuthToken(undefined)
    setAuthEmail("")
    setAuthProfile("")
    setIsAuthenticated(false)
  }, [setAuthEmail, setAuthProfile, setAuthToken, setIsAuthenticated])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return ValidationTypes.REQUIRED
    if (authEmail.length < 6) return ValidationTypes.MIN_LENGTH
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return ValidationTypes.EMAIL
    return ""
  }, [authEmail]) as TxKeyPath

  const doAuth = useCallback(
    async (profile: IUserClient, token: string) => {
      await setAuthToken(token)
      if (profile.profile.isUserConfirmed) {
        setIsUserConfirmed(true)
      } else {
        setIsUserConfirmed(false)
      }
      setAuthProfile(JSON.stringify(profile))
    },
    [setAuthToken, setAuthProfile],
  )

  const value: AuthContextType = {
    isAuthenticated,
    isUserConfirmed,
    authEmail,
    setAuthToken,
    setAuthEmail,
    logout,
    validationError,
    authProfile: authProfile ? (JSON.parse(authProfile) as IUserClient) : null,
    doAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
