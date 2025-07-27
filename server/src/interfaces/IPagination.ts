export interface IPagination<T> {
    data: T[];
    cursor: string | number;
    limit: number;
}
