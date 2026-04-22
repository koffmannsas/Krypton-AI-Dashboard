import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// 🔥 GET TRANSACTIONS (REALTIME)
export const subscribeTransactions = (
  companyId: string,
  callback: (data: any[]) => void
) => {
  const ref = collection(db, `companies/${companyId}/transactions`);
  const q = query(ref, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(transactions);
  });
};

// 🔥 CREATE TRANSACTION
export const createTransaction = async (
  companyId: string,
  data: {
    amount: number;
    customerId?: string;
    status?: string;
    paymentMethod?: string;
  }
) => {
  const ref = collection(db, `companies/${companyId}/transactions`);

  return await addDoc(ref, {
    amount: data.amount,
    customerId: data.customerId || null,
    status: data.status || "pending",
    paymentMethod: data.paymentMethod || "fiko",
    createdAt: serverTimestamp(),
  });
};