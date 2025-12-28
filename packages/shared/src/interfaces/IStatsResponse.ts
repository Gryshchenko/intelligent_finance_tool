export interface IStatsResponse<T> {
    from: string;
    to: string;
    items: T[];
    total: number;
}
