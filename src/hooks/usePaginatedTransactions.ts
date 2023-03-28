import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

const MOCK_DATA_KEY = "mock-data"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    let transactions: Transaction[]
    const cachedData = localStorage.getItem(MOCK_DATA_KEY)
    if (cachedData) {
      transactions = JSON.parse(cachedData)
    } else {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
        "paginatedTransactions",
        {
          page: paginatedTransactions?.nextPage ?? 0,
        }
      )
      if (!response) {
        return
      }
      transactions = response.data
      localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(transactions))
    }

    const page = paginatedTransactions?.nextPage ?? 0
    const start = page * 5
    const end = start + 5
    const data = transactions.slice(start, end)

    const nextPage = end < transactions.length ? page + 1 : null

    const response = { data, nextPage }

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }
      return { data: response.data ?? [], nextPage: response.nextPage }
    })
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
