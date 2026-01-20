import { FreeCurrencyApi } from 'services/exchangeRateService/providers/FreeCurrencyApi';
import { getConfig } from 'src/config/config';

export default class RateProviderBuilder {
    public static build() {
        const { rateProviderAPI, rateProviderUrl } = getConfig();
        return new FreeCurrencyApi(rateProviderAPI, rateProviderUrl);
    }
}
