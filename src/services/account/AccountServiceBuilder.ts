import AccountService from 'services/account/AccountService';
import AccountDataAccess from 'services/account/AccountDataAccess';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import { IDatabaseConnection } from 'interfaces/IDatabaseConnection';

export default class AccountServiceBuilder {
    public static build(db?: IDatabaseConnection): AccountService {
        const databaseConnection = db ?? DatabaseConnectionBuilder.build();
        return new AccountService(new AccountDataAccess(databaseConnection));
    }
}
