import { MMKV } from "react-native-mmkv";
export declare const storage: MMKV;
/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export declare function loadString(key: string): string | null;
/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export declare function saveString(key: string, value: string): boolean;
/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export declare function load<T>(key: string): T | null;
/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export declare function save(key: string, value: unknown): boolean;
/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export declare function remove(key: string): void;
/**
 * Burn it all to the ground.
 */
export declare function clear(): void;
