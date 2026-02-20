import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export function getStoredNumber(key: string, defaultValue: number = 0): number {
  return storage.getNumber(key) ?? defaultValue
}

export function getStoredString(key: string, defaultValue: string = ''): string {
  return storage.getString(key) ?? defaultValue
}

export function getStoredBoolean(key: string, defaultValue: boolean = false): boolean {
  return storage.getBoolean(key) ?? defaultValue
}

export function getStoredObject<T>(key: string, defaultValue: T): T {
  const raw = storage.getString(key)
  if (!raw) return defaultValue
  try {
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

export function setStoredObject<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value))
}
