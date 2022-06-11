export function calculateLastInstallmentDate(
  firstInstallment: Date,
  frequencyInDays: number,
  tokens: { amount: number; installment_amount: number }[]
) {
  // Find token with most installments
  let numberOfInstallments = 0;
  for (const token of tokens) {
    numberOfInstallments = Math.max(
      numberOfInstallments,
      calculateInstallmentAmount(token.installment_amount, token.amount)
    );
  }

  const lastDate = firstInstallment;
  lastDate.setDate(lastDate.getDate() + frequencyInDays * numberOfInstallments);
  return lastDate;
}

export function calculateInstallmentAmount(
  singleInstallmentAmount: number,
  fullAmount: number
) {
  return Math.ceil(fullAmount / singleInstallmentAmount);
}
