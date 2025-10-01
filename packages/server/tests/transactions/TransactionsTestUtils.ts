import { TransactionType } from 'tenpercent/shared/src/types/TransactionType';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { Agent } from 'supertest';
import { generateRandomString, generateSecureRandom } from '../TestsUtils.';

async function postTransaction(
    agent: Agent,
    userId: number,
    authorization: string,
    payload: Record<string, unknown>,
): Promise<number> {
    const {
        body: {
            data: { transactionId },
        },
    } = await agent
        .post(`/user/${userId}/transaction/`)
        .set('authorization', authorization)
        .send(payload)
        .expect(HttpCode.CREATED);
    return transactionId;
}

async function createTransferTransactions(
    agent: Agent,
    userId: number,
    authorization: string,
    accountId: number,
    targetAccountId: number,
    currencyId: number,
    amount = 100,
    count = 9,
): Promise<number[]> {
    const transactionIds: number[] = [];
    for (const _ of Array(count)) {
        const id = await postTransaction(agent, userId, authorization, {
            accountId,
            currencyId,
            transactionTypeId: TransactionType.Transafer,
            targetAccountId,
            amount: amount + generateSecureRandom(),
            description: 'Test transfer',
        });
        transactionIds.push(id);
    }
    return transactionIds;
}

async function createIncomeTransactions(
    agent: Agent,
    userId: number,
    authorization: string,
    accountId: number,
    incomeId: number,
    currencyId: number,
    amount = 100,
    count = 9,
): Promise<number[]> {
    const transactionIds: number[] = [];
    for (const _ of Array(count)) {
        const id = await postTransaction(agent, userId, authorization, {
            accountId,
            incomeId,
            transactionTypeId: TransactionType.Income,
            amount,
            currencyId,
            description: 'Test income',
        });
        transactionIds.push(id);
    }
    return transactionIds;
}

async function createExpenseTransactions(
    agent: Agent,
    userId: number,
    authorization: string,
    accountId: number,
    categoryId: number,
    currencyId: number,
    amount = 100,
    count = 9,
): Promise<number[]> {
    const transactionIds: number[] = [];
    for (const _ of Array(count)) {
        const id = await postTransaction(agent, userId, authorization, {
            accountId,
            categoryId,
            transactionTypeId: TransactionType.Expense,
            amount,
            currencyId,
            description: 'Test expense',
        });
        transactionIds.push(id);
    }
    return transactionIds;
}

async function createAllTransactions(
    agent: Agent,
    userId: number,
    authorization: string,
    accountId: number,
    currencyId: number,
    categoryId: number,
    incomeId: number,
    targetAccountId: number,
): Promise<number[]> {
    const transferIds = await createTransferTransactions(agent, userId, authorization, accountId, targetAccountId, currencyId);
    const incomeIds = await createIncomeTransactions(agent, userId, authorization, accountId, incomeId, currencyId);
    const expenseIds = await createExpenseTransactions(agent, userId, authorization, accountId, categoryId, currencyId);
    return [...transferIds, ...incomeIds, ...expenseIds];
}
async function fetchTransactions(agent: Agent, userId: number, authorization: string, limit: number, cursor: number, query = '') {
    const {
        body: {
            data: { limit: resLimit, cursor: resCursor, data },
        },
    } = await agent
        .get(`/user/${userId}/transactions/?limit=${limit}&cursor=${cursor}${query}`)
        .set('authorization', authorization)
        .expect(HttpCode.OK);
    return { resLimit, resCursor, data };
}

async function fetchTransactionsAll(agent: Agent, userId: number, authorization: string, limit: number, cursor: any) {
    const {
        body: { data: all },
    } = await agent
        .get(`/user/${userId}/transactions/?limit=${limit}&cursor=${cursor}`)
        .set('authorization', authorization)
        .expect(HttpCode.OK);
    return all;
}

async function fetchTransactionsBad(agent: Agent, userId: number, authorization: string) {
    await agent
        .get(`/user/${userId}/transactions/?limit=3&cursor=invalid_cursor`)
        .set('authorization', authorization)
        .expect(HttpCode.BAD_REQUEST);
}

export { fetchTransactionsBad, fetchTransactionsAll, fetchTransactions, createAllTransactions };
