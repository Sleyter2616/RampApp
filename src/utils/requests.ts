import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  SetTransactionApprovalParams,
  Transaction,
  Employee,
} from "./types"
import mockData from "../mock-data.json"

const TRANSACTIONS_PER_PAGE = 5
const MOCK_DATA_KEY = "mock-data"

const data: { employees: Employee[]; transactions: Transaction[] } = {
  employees: mockData.employees,
  transactions: mockData.transactions,
}

export const getEmployees = (): Employee[] => data.employees

export const getTransactionsPaginated = ({
  page,
}: PaginatedRequestParams): PaginatedResponse<Transaction[]> => {
  if (page === null) {
    throw new Error("Page cannot be null")
  }

  const start = page * TRANSACTIONS_PER_PAGE
  const end = start + TRANSACTIONS_PER_PAGE

  if (start > data.transactions.length) {
    throw new Error(`Invalid page ${page}`)
  }

  const nextPage = end < data.transactions.length ? page + 1 : null

  return {
    nextPage,
    data: data.transactions.slice(start, end),
  }
}

export const getTransactionsByEmployee = ({ employeeId }: RequestByEmployeeParams) => {
  if (!employeeId) {
    throw new Error("Employee id cannot be empty")
  }

  return data.transactions.filter((transaction) => transaction.employee.id === employeeId)
}

export const setTransactionApproval = ({ transactionId, value }: SetTransactionApprovalParams): void => {
  const cachedData = localStorage.getItem(MOCK_DATA_KEY)

  let transactions = []
  if (cachedData) {
    transactions = JSON.parse(cachedData)
    const transactionIndex = transactions.findIndex(
      (transaction: { id: string }) => transaction.id === transactionId
    )
    if (transactionIndex === -1) {
      throw new Error("Invalid transaction ID")
    }

    transactions[transactionIndex].approved = value
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(transactions)) // update mock data in localStorage
  } else {
    const transaction = data.transactions.find(
      (currentTransaction) => currentTransaction.id === transactionId
    )

    if (!transaction) {
      throw new Error("Invalid transaction to approve")
    }

    transaction.approved = value
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(data.transactions)) // update mock data in localStorage
  }
}
