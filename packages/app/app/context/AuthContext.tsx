import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { IUserClient } from "tenpercent/shared/src/interfaces/IUserClient"
import { UserStatus } from "tenpercent/shared/src/interfaces/UserStatus"
import Utils from "tenpercent/shared/src/Utils"

import { api } from "@/services/api"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { SecureStorageKey } from "@/types/SecureStorageKey"
import { StorageKey } from "@/types/StorageKey"
import { loadString, saveString } from "@/utils/storage"
import createStorage from "@/utils/storage/SecureStorage"

interface SetAuth {
  token: string | null
  email: string | null
  status: UserStatus | null
  userId: number | null
}

export interface AuthContextType {
  isAuthenticated: boolean
  isUserConfirmed: boolean
  authEmail?: string | null
  userId?: number | null
  userStatus?: UserStatus | null
  setUserId: (userId: number) => void
  setAuth: ({ token, email, status, userId }: SetAuth) => Promise<void>
  setIsPasswordSaveCheckbox: (save: boolean) => void
  updateAuthToken: (newToken: string | null) => Promise<void>
  isPasswordSaveCheckbox: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isUserConfirmed, setIsUserConfirmed] = useState<boolean>(false)
  const [, setAuthToken] = useState<string | null>(null)
  const [authEmail, setAuthEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [isPasswordSaveCheckbox, setIsPasswordSave] = useState<boolean>(false)

  const handleUserStatus = useCallback((status: UserStatus) => {
    switch (status) {
      case UserStatus.INACTIVE:
        setIsAuthenticated(false)
        return false
      case UserStatus.NO_VERIFIED:
        setIsUserConfirmed(false)
        break
      case UserStatus.ACTIVE:
        setIsUserConfirmed(true)
        break
    }
    return true
  }, [])

  useEffect(() => {
    ;(async () => {
      const secureStorage = await createStorage()
      const saved = loadString(StorageKey.SavePassword)
      const isPassword: boolean = saved ? (Utils.parseBoolean(saved) as boolean) : false
      setIsPasswordSave(isPassword)

      if (!isPassword) return

      const credentials = await secureStorage.get(SecureStorageKey.Auth)
      if (!credentials?.key) {
        setIsAuthenticated(false)
        await secureStorage.remove(SecureStorageKey.Auth)
        return
      }

      const token = credentials.key.slice(6)
      const response = await api.doTokenVerify({ token })
      if (response.kind === GeneralApiProblemKind.Ok) {
        const { userId, email, status } = response.data as IUserClient
        const proceed = handleUserStatus(status)
        if (!proceed) {
          await secureStorage.remove(SecureStorageKey.Auth)
          return
        }

        setUserId(userId)
        setUserStatus(status)
        setAuthEmail(email)
        setIsAuthenticated(true)
        setAuthToken(token)
      } else {
        setIsAuthenticated(false)
        await secureStorage.remove(SecureStorageKey.Auth)
      }
    })()
  }, [handleUserStatus])

  const setIsPasswordSaveCheckbox = useCallback((save: boolean) => {
    setIsPasswordSave(save)
    saveString(StorageKey.SavePassword, String(save))
  }, [])

  const updateAuthToken = useCallback(
    async (newToken: string | null) => {
      if (!newToken) {
        console.error("Update auth token update failed, new token empty")
        return
      }
      if (!authEmail) {
        console.error("Update auth token update failed, authEmail empty")
        return
      }
      const secureStorage = await createStorage()
      await secureStorage.save(SecureStorageKey.Auth, newToken, authEmail)
    },
    [authEmail],
  )

  const setAuth = useCallback(
    async ({ token, email, status, userId }: SetAuth) => {
      const secureStorage = await createStorage()

      if (!token || !email || !status || !userId) {
        await secureStorage.remove(SecureStorageKey.Auth)
        setIsAuthenticated(false)
        return
      }

      const proceed = handleUserStatus(status)
      if (!proceed) {
        await secureStorage.remove(SecureStorageKey.Auth)
        return
      }

      setAuthEmail(email)
      setUserStatus(status)
      setUserId(userId)
      await secureStorage.save(SecureStorageKey.Auth, token, email)
      setIsAuthenticated(true)
    },
    [handleUserStatus],
  )

  const logout = useCallback(async () => {
    await setAuth({ token: null, email: null, status: null, userId: null })
    setAuthEmail(null)
    setUserId(null)
    setUserStatus(null)
    setIsAuthenticated(false)
  }, [setAuth])

  const value: AuthContextType = {
    isAuthenticated,
    isUserConfirmed,
    authEmail,
    setAuth,
    userStatus: userStatus as unknown as UserStatus | null,
    setUserId,
    userId,
    logout,
    setIsPasswordSaveCheckbox,
    isPasswordSaveCheckbox,
    updateAuthToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
