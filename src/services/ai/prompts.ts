export const businessInsightPrompt = (data: any) => `
Tu es un expert en croissance business.

Analyse ces données :

- Revenu: ${data.revenue} FCFA
- Clients: ${data.customers}
- Transactions: ${data.transactions}

Donne :
1. 2 problèmes
2. 2 opportunités
3. 1 action concrète à faire aujourd’hui

Réponse courte, claire, impactante.
`;