import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import ExchangeRateService from 'services/ExchangeRateService/ExchangeRateService';
import ExchangeRateDataAccess from 'services/ExchangeRateService/ExchangeRateDataAccess';
import CurrencyServiceBuilder from 'services/currency/CurrencyServiceBuilder';

export default class ExchangeRateServiceBuilder {
    public static build(db = DatabaseConnectionBuilder.build()) {
        return new ExchangeRateService(new ExchangeRateDataAccess(db), CurrencyServiceBuilder.build(db));
    }
}
