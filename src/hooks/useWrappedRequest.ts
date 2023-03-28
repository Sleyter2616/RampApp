import { useCallback, useContext, useState } from "react"
import { AppContext } from "../utils/context"
export function useWrappedRequest() {
  const [loading, setLoading] = useState(false)
  const { setError } = useContext(AppContext)

  const wrappedRequest = useCallback(
    async <TData extends any = void>(promise: () => Promise<TData>): Promise<TData | null> => {
      try {
        setLoading(true)
        console.log("Request started")
        const result = await promise()
        console.log("Request successful")
        return result
      } catch (error) {
        console.error("Request error:", error)
        setError(error as string)
        throw error // re-throw the error so that the calling code can handle it
      } finally {
        setLoading(false)
        console.log("Request finished")
      }
    },
    [setError]
  )

  return { loading, wrappedRequest }
}
