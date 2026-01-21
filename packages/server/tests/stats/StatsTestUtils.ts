import { ICategoryStats, IStatsResponse, ISummary, StatsPeriod } from 'tenpercent/shared';
import { HttpCode } from 'tenpercent/shared';
import { Agent } from 'supertest';

async function getSummary(
    agent: Agent,
    userId: number,
    authorization: string,
    payload: {
        from: string;
        to: string;
        period: StatsPeriod;
    },
): Promise<ISummary> {
    const { from, to, period } = payload;
    const {
        body: { data },
    } = await agent
        .get(`/user/${userId}/stats/summary?from=${from}&to=${to}&period=${period}`)
        .set('authorization', authorization)
        .send(payload)
        .expect(HttpCode.OK);
    return data as ISummary;
}

async function getIncomesWithStats(
    agent: Agent,
    userId: number,
    authorization: string,
    payload: {
        from: string;
        to: string;
        period: StatsPeriod;
    },
): Promise<IStatsResponse<ICategoryStats>> {
    const { from, to, period } = payload;
    const {
        body: { data },
    } = await agent
        .get(`/user/${userId}/incomes/stats?from=${from}&to=${to}&period=${period}`)
        .set('authorization', authorization)
        .send(payload)
        .expect(HttpCode.OK);
    return {
        from: data.from,
        to: data.to,
        items: data.items,
        total: data.total,
    };
}

async function getCategoriesWithStats(
    agent: Agent,
    userId: number,
    authorization: string,
    payload: {
        from: string;
        to: string;
        period: StatsPeriod;
    },
): Promise<IStatsResponse<ICategoryStats>> {
    const { from, to, period } = payload;
    const {
        body: { data },
    } = await agent
        .get(`/user/${userId}/categories/stats?from=${from}&to=${to}&period=${period}`)
        .set('authorization', authorization)
        .send(payload)
        .expect(HttpCode.OK);
    return {
        from: data.from,
        to: data.to,
        items: data.items,
        total: data.total,
    };
}

export { getCategoriesWithStats, getSummary, getIncomesWithStats };
