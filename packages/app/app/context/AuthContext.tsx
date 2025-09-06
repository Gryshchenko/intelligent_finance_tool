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

import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { AuthService } from "@/services/AuthService"
import { LoginService } from "@/services/LoginService"
import { StorageKey } from "@/types/StorageKey"
import { Logger } from "@/utils/logger/Logger"
import { loadString, saveString } from "@/utils/storage"

export interface AuthContextType {
  isAuthenticated: boolean
  isUserConfirmed: boolean
  setIsPasswordSaveCheckbox: (save: boolean) => void
  isPasswordSaveCheckbox: boolean
  doLogout: () => Promise<boolean>
  doLogin: ({
    token,
    email,
    status,
    userId,
    tokenLong,
  }: {
    token: string
    email: string
    status: UserStatus
    userId: number
    tokenLong: string
  }) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

const _logger = Logger.Of("AuthContext")

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isUserConfirmed, setIsUserConfirmed] = useState<boolean>(false)
  const [isPasswordSaveCheckbox, setIsPasswordSave] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      try {
        const authService = new AuthService()
        const saved = loadString(StorageKey.isSavePassword)
        const isPassword: boolean = saved ? (Utils.parseBoolean(saved) as boolean) : false
        setIsPasswordSave(isPassword)

        if (!isPassword) return

        const user = await authService.getCredentialFromSecureStore()
        if (!user) {
          throw new Error("User object empty")
        }

        const { token, userId, tokenLong } = user
        if (!tokenLong) {
          throw new Error("Token long empty")
        }
        if (!token) {
          throw new Error("Token empty")
        }

        if (!userId) {
          throw new Error("UserId empty")
        }

        const response = await LoginService.instance().doTokenVerify({ userId, token })
        if (response.kind === GeneralApiProblemKind.Ok) {
          const { userId, email, status } = response.data as IUserClient
          const result = await AuthService.instance().authorize({
            token,
            tokenLong,
            status,
            userId,
            email,
          })
          if (result) {
            setIsAuthenticated(true)
            setIsUserConfirmed(status === UserStatus.ACTIVE)
          } else {
            setIsAuthenticated(false)
            setIsUserConfirmed(false)
            await AuthService.instance().unauthorize()
          }
        } else {
          await AuthService.instance().unauthorize()
          await AuthService.instance().cleanCredentialStore()
          throw new Error(`DoTokenVerify failed:  ${JSON.stringify(response)}`)
        }
      } catch (e) {
        await AuthService.instance().cleanCredentialStore()
        setIsAuthenticated(false)
        await AuthService.instance().unauthorize()
        _logger.error("Auto authentication failed due reason: ", (e as { message: string }).message)
      }
    })()
  }, [])

  const setIsPasswordSaveCheckbox = useCallback((save: boolean) => {
    setIsPasswordSave(save)
    saveString(StorageKey.isSavePassword, String(save))
  }, [])

  const doLogin = useCallback(
    async ({
      token,
      email,
      status,
      userId,
      tokenLong,
    }: {
      token: string
      email: string
      status: UserStatus
      userId: number
      tokenLong: string
    }): Promise<boolean> => {
      try {
        const result = await AuthService.instance().authorize({
          token,
          tokenLong,
          status,
          userId,
          email,
        })
        if (result) {
          setIsAuthenticated(true)
          setIsUserConfirmed(status === UserStatus.ACTIVE)
          return true
        } else {
          setIsAuthenticated(false)
          setIsUserConfirmed(false)
          return false
        }
      } catch (e) {
        setIsUserConfirmed(false)
        setIsAuthenticated(false)
        _logger.error("Do authentication failed due reason: ", (e as { message: string }).message)
        return false
      }
    },
    [],
  )

  const doLogout = useCallback(async (): Promise<boolean> => {
    try {
      const response = await LoginService.instance().doLogout()
      await AuthService.instance().unauthorize()
      if (response.kind !== GeneralApiProblemKind.Ok) {
        _logger.error("Do logout failed due reason: ", response.kind)
        return false
      }
      setIsAuthenticated(false)
      setIsUserConfirmed(false)
      return true
    } catch (e) {
      _logger.error("Do logout failed due reason: ", (e as { message: string }).message)
      return false
    }
  }, [])

  const value: AuthContextType = {
    isAuthenticated,
    isPasswordSaveCheckbox,
    isUserConfirmed,
    setIsPasswordSaveCheckbox,
    doLogin,
    doLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
