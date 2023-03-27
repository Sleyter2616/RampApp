import { useState ,useEffect} from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved)

  console.log("Transaction pane rendering:", transaction, loading, consumerSetTransactionApproval)

  useEffect(() => {
    console.log("Approved value:", approved);
  }, [approved]);

  const handleCheckboxChange = async (checked: boolean) => {
    console.log("Checkbox value changing:", checked);
    await consumerSetTransactionApproval({
      transactionId: transaction.id,
      newValue: checked, // pass the new value
    });

    setApproved(checked); // update the state with the new value
    console.log(`approved value: ${checked}`);
  };

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={handleCheckboxChange}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
