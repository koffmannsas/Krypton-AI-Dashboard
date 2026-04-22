export const generateInsights = (data: {
  customers: number;
  revenue: number;
  transactions: number;
}) => {
  const insights: string[] = [];

  // 🔥 LOW REVENUE ALERT
  if (data.revenue < 50000) {
    insights.push("💡 Votre revenu est faible. Lancez une campagne aujourd’hui.");
  }

  // 🔥 LOW CUSTOMERS
  if (data.customers < 10) {
    insights.push("💡 Ajoutez plus de clients pour augmenter vos ventes.");
  }

  // 🔥 HIGH POTENTIAL
  if (data.transactions > 5) {
    insights.push("🚀 Bon volume de transactions. Vous pouvez scaler avec des campagnes.");
  }

  // 🔥 DEFAULT
  if (insights.length === 0) {
    insights.push("✅ Votre business est stable. Continuez vos efforts !");
  }

  return insights;
};