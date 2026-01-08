import { MMKV } from "react-native-mmkv"
export const storage = new MMKV({ id: "ten.percent.app" })
/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key) {
  try {
    return storage.getString(key) ?? null
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null
  }
}
/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key, value) {
  try {
    storage.set(key, value)
    return true
  } catch {
    return false
  }
}
/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function load(key) {
  let almostThere = null
  try {
    almostThere = loadString(key)
    return JSON.parse(almostThere ?? "")
  } catch {
    return almostThere ?? null
  }
}
/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save(key, value) {
  try {
    saveString(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key) {
  try {
    storage.delete(key)
  } catch {}
}
/**
 * Burn it all to the ground.
 */
export function clear() {
  try {
    storage.clearAll()
  } catch {}
}
