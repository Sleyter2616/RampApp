import { useCallback, useState } from "react"
import { Employee } from "../utils/types"
import { useCustomFetch } from "./useCustomFetch"
import { EmployeeResult } from "./types"

export function useEmployees(): EmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [employees, setEmployees] = useState<Employee[] | null>(null)

  const fetchAll = useCallback(async () => {
    console.log("Fetching employees...")
    const employeesData = await fetchWithCache<Employee[]>("employees")
    console.log("Employees data:", employeesData)
    setEmployees(employeesData)
  }, [fetchWithCache])

  const invalidateData = useCallback(() => {
    console.log("Invalidating employees data...")
    setEmployees(null)
  }, [])

  return { data: employees, loading, fetchAll, invalidateData }
}
