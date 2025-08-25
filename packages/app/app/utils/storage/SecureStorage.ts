import * as Keychain from "react-native-keychain"
import { UserCredentials } from "react-native-keychain"

import { SecureStorageKey } from "@/types/SecureStorageKey"
import { load, remove, save } from "@/utils/storage/index"

interface IStorage {
  save(service: SecureStorageKey, key: string, value: string): Promise<void>
  get(service: SecureStorageKey): Promise<{ key: string; value: string } | null>
  remove(service: SecureStorageKey): Promise<void>
}

class SecureStorage implements IStorage {
  async save(service: SecureStorageKey, key: string, value: string) {
    await Keychain.setGenericPassword(key, value, {
      service: service,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
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
