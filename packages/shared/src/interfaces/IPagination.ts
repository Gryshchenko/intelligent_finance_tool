export interface IPagination<T> {
    data: T[];
    cursor: number;
    limit: number;
}
