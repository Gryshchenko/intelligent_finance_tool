export interface ITransaction {
    transactionId: number;
    accountId: number;
    targetAccountId?: number;
    incomeId?: number;
    categoryId?: number;
    currencyId: number;
    currencyCode: string;
    currencyName: string;
    symbol: string;
    transactionTypeId: number;
    amount: number;
    description: string;
    createdAt: string;
}
