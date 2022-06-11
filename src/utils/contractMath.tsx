export function calculateLastInstallmentDate(firstInstallment: Date,
                                      frequencyInDays: number,
                                      fullAmount: number,
                                      singleInstallmentAmount: number){
    const numberOfInstallments = calculateInstallmentAmount(fullAmount, singleInstallmentAmount);
    const lastDate = firstInstallment;
    lastDate.setDate(lastDate.getDate() + frequencyInDays * numberOfInstallments);
    return lastDate;
}

export function calculateInstallmentAmount(singleInstallmentAmount: number, fullAmount: number) {
    return Math.ceil(fullAmount / singleInstallmentAmount);
}
