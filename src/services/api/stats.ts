import { db } from "../../firebase/config";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

export const subscribeStats = (
  companyId: string,
  callback: (data: any) => void
) => {
  const ref = collection(db, `companies/${companyId}/transactions`);

  return onSnapshot(
    query(ref),
    (snapshot) => {
      let totalRevenue = 0;
      let monthlyData: any = {};

      snapshot.docs.forEach((doc) => {
        const tx = doc.data();

        if (tx.status === "paid") {
          totalRevenue += tx.amount;

          const date = tx.createdAt?.toDate?.() || new Date();
          const month = date.toLocaleString("default", { month: "short" });

          if (!monthlyData[month]) {
            monthlyData[month] = 0;
          }

          monthlyData[month] += tx.amount;
        }
      });

      const chartData = Object.keys(monthlyData).map((month) => ({
        name: month,
        revenue: monthlyData[month],
      }));

      callback({
        totalRevenue,
        chartData,
      });
    },
    (error) => {
      console.error("❌ Error fetching stats:", error);
    }
  );
};