import * as Keychain from "react-native-keychain"
import { UserCredentials } from "react-native-keychain"

import { SecureStorageKey } from "@/types/SecureStorageKey"
import { load, remove, save } from "@/utils/storage/index"

export enum BiometryType {
  FACE_ID = "FACE_ID",
  TOUCH_ID = "TOUCH_ID",
  FINGERPRINT = "FINGERPRINT",
  NONE = "NONE",
}

interface IStorage {
  save(service: SecureStorageKey, key: string, value: string): Promise<void>
  get(service: SecureStorageKey): Promise<{ key: string; value: string } | null>
  remove(service: SecureStorageKey): Promise<void>
  checkBiometry(): Promise<BiometryType>
}

class SecureStorage implements IStorage {
  async save(service: SecureStorageKey, key: string, value: string) {
    await Keychain.setGenericPassword(key, value, {
      service: service,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    })
  }
  async get(key: SecureStorageKey) {
    const creds: false | UserCredentials = await Keychain.getGenericPassword({ service: key })
    if (creds) {
      return {
        key: creds.username,
        value: creds.password,
      }
    }
    return null
  }
  async remove(key: SecureStorageKey) {
    await Keychain.resetGenericPassword({ service: key })
  }

  public async checkBiometry(): Promise<BiometryType> {
    const biometryType = await Keychain.getSupportedBiometryType()

    if (biometryType === Keychain.BIOMETRY_TYPE.FACE_ID) {
      return BiometryType.FACE_ID
    } else if (biometryType === Keychain.BIOMETRY_TYPE.TOUCH_ID) {
      return BiometryType.TOUCH_ID
    } else if (biometryType === Keychain.BIOMETRY_TYPE.FINGERPRINT) {
      return BiometryType.FINGERPRINT
    } else {
      return BiometryType.NONE
    }
  }
}

class FallbackStorage implements IStorage {
  async save(key: SecureStorageKey, value: string, service: string) {
    save(service, {
      key,
      value,
    })
  }
  async get(service: SecureStorageKey): Promise<{ key: string; value: string } | null> {
    return new Promise((resolve, reject) => {
      try {
        return resolve(load<{ key: string; value: string } | null>(service))
      } catch {
        return reject()
      }
    })
  }
  async remove(key: SecureStorageKey) {
    remove(key)
  }
  public async checkBiometry(): Promise<BiometryType> {
    return new Promise((resolve) => {
      resolve(BiometryType.NONE)
    })
  }
}

async function createStorage(): Promise<IStorage> {
  try {
    return new SecureStorage()
  } catch {
    console.warn("Secure storage unavailable, falling back to AsyncStorage")
    return new FallbackStorage()
  }
}

export default createStorage
