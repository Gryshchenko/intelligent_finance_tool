export interface ITransactionListItemsRequest {
    userId: number;
    limit: number;
    cursor: number;
    accountId?: number;
    categoryId?: number;
    incomeId?: number;
    orderBy?: string;
}
