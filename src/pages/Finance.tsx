import { useEffect, useState } from "react";
import { subscribeTransactions } from "../services/api/transactions";

export default function Finance() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeTransactions("default-company", setTransactions);

    return () => unsubscribe(); // cleanup
  }, []);

  return <div className="text-2xl font-bold">Finance Page</div>;
}
