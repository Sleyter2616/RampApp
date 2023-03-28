import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

const MOCK_DATA_KEY = "mock-data"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      let transactions: Transaction[]
      const cachedData = localStorage.getItem(MOCK_DATA_KEY)
      if (cachedData) {
        transactions = JSON.parse(cachedData)
      } else {
        const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
          "transactionsByEmployee",
          {
            employeeId,
          }
        )
        transactions = data || []
      }

      const filteredTransactions = transactions.filter(
        (transaction) => transaction.employee.id === employeeId
      )
      setTransactionsByEmployee(filteredTransactions)

      localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(transactions))
    },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}
