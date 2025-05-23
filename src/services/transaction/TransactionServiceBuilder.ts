import AccountServiceBuilder from 'services/account/AccountServiceBuilder';
import TransactionDataAccess from 'services/transaction/TransactionDataAccess';
import TransactionService from 'services/transaction/TransactionService';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';

export default class TransactionServiceBuilder {
    public static build() {
        const db = DatabaseConnectionBuilder.build();
        return new TransactionService(new TransactionDataAccess(db), AccountServiceBuilder.build(db), db);
    }
}
