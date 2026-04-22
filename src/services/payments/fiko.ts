import { createTransaction } from "../api/transactions";

// 🔥 CREATE PAYMENT LINK
export const createFikoPayment = async (
  companyId: string,
  data: {
    amount: number;
    customerId?: string;
    description?: string;
  }
) => {
  try {
    // 💡 SIMULATION (remplacer par API FikoPay plus tard)
    const fakePaymentLink = `https://pay.fiko.ai/link/${Date.now()}`;

    // 🔥 créer transaction en pending
    await createTransaction(companyId, {
      amount: data.amount,
      customerId: data.customerId,
      status: "pending",
      paymentMethod: "fiko",
    });

    return {
      paymentLink: fakePaymentLink,
    };
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    throw error;
  }
};