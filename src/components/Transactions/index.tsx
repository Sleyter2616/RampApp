import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  console.log('Rendering Transactions component')
  const { fetchWithoutCache, loading } = useCustomFetch()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      console.log(`setTransactionApproval called with transactionId: ${transactionId} and newValue: ${newValue}`)
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
      console.log(`setTransactionApproval executed successfully for transactionId: ${transactionId}`);
    },
    [fetchWithoutCache]
  )

  console.log('Transactions value:', transactions);
  if (transactions === null) {
    console.log('No transactions to display');
    return <div className="RampLoading--container">Loading...</div>
  }

  console.log(`Rendering ${transactions.length} transactions`)
  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => {
        console.log(`ya ${transaction.id}`);
        return (
          <TransactionPane
            key={transaction.id}
            transaction={transaction}
            loading={loading}
            setTransactionApproval={setTransactionApproval}
          />
        );
      })}
    </div>
  );

}
