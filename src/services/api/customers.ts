import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// 🧠 TYPES (PRO)
export interface Customer {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  tags?: string[];
  total_spent?: number;
  orders_count?: number;
  status?: "active" | "inactive";
  lifecycle?: "cold" | "warm" | "hot";
  createdAt?: any;
  last_activity?: any;
}

// 🔥 SUBSCRIBE CUSTOMERS (REALTIME)
export const subscribeCustomers = (
  companyId: string,
  callback: (data: Customer[]) => void
) => {
  const ref = collection(db, `companies/${companyId}/customers`);
  const q = query(ref, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const customers: Customer[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Customer[];

      callback(customers);
    },
    (error) => {
      console.error("❌ Error fetching customers:", error);
    }
  );
};

// 🔥 CREATE CUSTOMER
export const createCustomer = async (
  companyId: string,
  data: Partial<Customer>
) => {
  try {
    const ref = collection(db, `companies/${companyId}/customers`);

    return await addDoc(ref, {
      name: data.name,
      phone: data.phone || "",
      email: data.email || "",
      tags: data.tags || [],
      total_spent: 0,
      orders_count: 0,
      status: "active",
      lifecycle: "cold",
      createdAt: serverTimestamp(),
      last_activity: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error creating customer:", error);
    throw error;
  }
};

// 🔥 UPDATE CUSTOMER
export const updateCustomer = async (
  companyId: string,
  customerId: string,
  data: Partial<Customer>
) => {
  try {
    const ref = doc(
      db,
      `companies/${companyId}/customers/${customerId}`
    );

    return await updateDoc(ref, {
      ...data,
    });
  } catch (error) {
    console.error("❌ Error updating customer:", error);
    throw error;
  }
};

// 🔥 DELETE CUSTOMER
export const deleteCustomer = async (
  companyId: string,
  customerId: string
) => {
  try {
    const ref = doc(
      db,
      `companies/${companyId}/customers/${customerId}`
    );

    return await deleteDoc(ref);
  } catch (error) {
    console.error("❌ Error deleting customer:", error);
    throw error;
  }
};

// 🔥 SUBSCRIBE CUSTOMERS COUNT (REALTIME)
export const subscribeCustomersCount = (
  companyId: string,
  callback: (count: number) => void
) => {
  try {
    const ref = collection(db, `companies/${companyId}/customers`);

    return onSnapshot(
      ref,
      (snapshot) => {
        callback(snapshot.size); // 🔥 nombre de clients
      },
      (error) => {
        console.error("❌ Error fetching customers count:", error);
      }
    );
  } catch (error) {
    console.error("❌ customersStats error:", error);
    throw error;
  }
};
