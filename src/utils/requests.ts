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
const MOCK_DATA_KEY ="mock-data"

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
  // Retrieve the transaction data from the cache
  const cachedData = localStorage.getItem(MOCK_DATA_KEY);
  if (!cachedData) {
    throw new Error("Unable to retrieve transaction data from cache");
  }

  // Parse the transaction data
  const transactions = JSON.parse(cachedData);

  // Find the transaction that matches the provided ID
  const transactionIndex = transactions.findIndex((transaction: { id: string }) => transaction.id === transactionId);
  if (transactionIndex === -1) {
    throw new Error("Invalid transaction ID");
  }

  // Update the transaction's approved status
  transactions[transactionIndex].approved = value;

  // Update the cache with the new transaction data
  localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(transactions));
};


