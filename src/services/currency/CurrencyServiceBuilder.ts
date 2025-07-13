import CurrencyDataAccess from 'services/currency/CurrencyDataAccess';
import CurrencyService from 'services/currency/CurrencyService';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import { ICurrencyService } from 'interfaces/ICurrencyService';

export default class CurrencyServiceBuilder {
    public static build(db = DatabaseConnectionBuilder.build()): ICurrencyService {
        return new CurrencyService(new CurrencyDataAccess(db));
    }
}
