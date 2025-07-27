export interface IRateStatus {
    total: number;
    used: number;
    remaining: number;
}

export interface IRateProvider {
    getRates(base_currency: string, currencies: string[]): Promise<Record<string, number>>;
}
