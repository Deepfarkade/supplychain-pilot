import { useState, useEffect } from 'react'

/**
 * Custom hook to persist state in sessionStorage
 * Maintains state during navigation but clears on logout/refresh
 */
export function useSessionState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setSessionState = (value: T) => {
    try {
      setState(value)
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Fallback to memory-only state if sessionStorage fails
      setState(value)
    }
  }

  return [state, setSessionState]
}