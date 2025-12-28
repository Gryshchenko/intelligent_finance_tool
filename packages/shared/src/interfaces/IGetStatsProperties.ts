import { StatsPeriod } from 'types/StatsPeriod';

export interface IGetStatsProperties {
    from: string;
    to: string;
    period: StatsPeriod;
}
