import { IUserClient } from "tenpercent/shared/src/interfaces/IUserClient"
import { UserStatus } from "tenpercent/shared/src/interfaces/UserStatus"
import Utils from "tenpercent/shared/src/Utils"

import { SecureStorageKey } from "@/types/SecureStorageKey"
import { Logger } from "@/utils/logger/Logger"
import createStorage from "@/utils/storage/SecureStorage"

interface IExtra {
  token: string
  tokenLong: string
}

export class AuthService {
  protected readonly _logger: Logger = Logger.Of("AuthService")

  private static _instance: AuthService

  public static instance(): AuthService {
    return AuthService._instance || (AuthService._instance = new AuthService())
  }
  protected _token: string | null = null
  protected _userId: number | null = null
  private serialization(user: IUserClient & IExtra): string | null {
    try {
      return JSON.stringify(user)
    } catch (e) {
      this._logger.error("Serialization failed due reason", e)
      return null
    }
  }

  private deserialize(serialization: string): (IUserClient & IExtra) | null {
    try {
      return JSON.parse(serialization)
    } catch (e) {
      this._logger.error("Deserialize failed due reason", e)
      return null
    }
  }

  public get userId(): number | null {
    return this._userId
  }

  public set userId(value: number | null) {
    if (Utils.isNull(this._userId)) {
      this._userId = value
    }
  }

  public set token(newToke: string) {
    this._token = newToke
    this._logger.info("Token updated")
  }
  public get token(): string | null {
    return this._token
  }

  public async setCredentialToSecureStore(user: IUserClient & IExtra): Promise<void> {
    try {
      const userStr = this.serialization(user)
      if (!userStr) {
        throw new Error("User serialization does not exist")
      }
      const storage = await createStorage()
      await storage.save(SecureStorageKey.AuthCredential, userStr, "")
    } catch (e) {
      this._logger.error("Secure storage creation failed", e)
    }
  }

  public async getCredentialFromSecureStore(): Promise<(IUserClient & IExtra) | null> {
    try {
      const storage = await createStorage()
      const credential = await storage.get(SecureStorageKey.AuthCredential)
      if (!credential?.key) {
        throw new Error("User not store in secure storage")
      }
      const user = this.deserialize(credential.key)
      if (!user || !user.token || !user.userId || !user.tokenLong) {
        throw new Error("User from secure storage not valid")
      }
      return user as IUserClient & IExtra
    } catch (e) {
      this._logger.error("Secure storage creation failed", e)
      return null
    }
  }

  public async cleanCredentialStore(): Promise<void> {
    try {
      const storage = await createStorage()
      await storage.remove(SecureStorageKey.AuthCredential)
    } catch (e) {
      this._logger.error("Secure storage cleanup failed", e)
    }
  }

  public async authorize({
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
  }): Promise<boolean> {
    try {
      if (!token || !email || !status || !userId || !tokenLong) {
        throw new Error("SetAuth failed not all properties valid ")
      }

      if (status === UserStatus.INACTIVE) {
        throw new Error("SetAuth failed user in inactive state")
      }
      this._token = token
      this._userId = userId

      await this.setCredentialToSecureStore({
        userId,
        status,
        token,
        tokenLong,
        email,
      })
      return true
    } catch (e) {
      this._logger.error(`SetAuth failed due reason: ${JSON.stringify(e)}`)
      await this.cleanCredentialStore()
      return false
    }
  }
  public async unauthorize(): Promise<boolean> {
    try {
      this._logger.info("Start logout process")
      this._userId = null
      this._token = null
      await this.cleanCredentialStore()
      this._logger.info("Logout process success finished")
      return true
    } catch (e) {
      this._logger.error("Logout process failed deu reason", JSON.stringify(e))
      return false
    }
  }

  public async getTokenLong(): Promise<string | null> {
    const data = await this.getCredentialFromSecureStore()
    if (!data) {
      return null
    }
    return data?.tokenLong
  }
}
