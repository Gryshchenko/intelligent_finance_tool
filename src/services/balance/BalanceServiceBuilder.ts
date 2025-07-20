import BalanceService from 'services/balance/BalanceService';
import BalanceDataAccess from 'services/balance/BalanceDataAccess';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import { IDatabaseConnection } from 'interfaces/IDatabaseConnection';
import ProfileServiceBuilder from 'services/profile/ProfileServiceBuilder';
import ExchangeRateServiceBuilder from 'services/ExchangeRateService/ExchangeRateServiceBuilder';

export default class BalanceServiceBuilder {
    public static build(db?: IDatabaseConnection): BalanceService {
        const databaseConnection = db ?? DatabaseConnectionBuilder.build();
        return new BalanceService(
            new BalanceDataAccess(databaseConnection),
            ProfileServiceBuilder.build(databaseConnection),
            ExchangeRateServiceBuilder.build(databaseConnection),
        );
    }
}
