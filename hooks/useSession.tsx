import { useCallback, useEffect, useState } from 'react'
import { accessTokenKey } from '../general/constants/localStorageKey'
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage'

export function useSession(
  defaultValue: boolean
): [isSession: boolean, setSession: (session: boolean) => void] {
  const [isSessionInternal, setSessionInternal] = useState(defaultValue)

  useEffect(() => {
      const change = async () => {
        const session = await asyncLocalStorage.getItem(accessTokenKey) === 'true'
        if (session !== defaultValue) {
          setSessionInternal(session)
        }
      }

      change();
  }, [setSessionInternal])

  const setSession = useCallback(
    async (isSession: boolean) => {
      await asyncLocalStorage.setItem(accessTokenKey, isSession ? 'true' : 'false')
      setSessionInternal(isSession)
    },
    [setSessionInternal]
  )

  return [isSessionInternal, setSession]
}
