import AccountServiceBuilder from 'services/account/AccountServiceBuilder';
import TransactionDataAccess from 'services/transaction/TransactionDataAccess';
import TransactionService from 'services/transaction/TransactionService';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import { IDatabaseConnection } from 'interfaces/IDatabaseConnection';
import BalanceServiceBuilder from 'services/balance/BalanceServiceBuilder';

export default class TransactionServiceBuilder {
    public static build(db?: IDatabaseConnection): TransactionService {
        const databaseConnection = db ?? DatabaseConnectionBuilder.build();
        return new TransactionService(
            new TransactionDataAccess(databaseConnection),
            AccountServiceBuilder.build(databaseConnection),
            BalanceServiceBuilder.build(databaseConnection),
            databaseConnection,
        );
    }
}
