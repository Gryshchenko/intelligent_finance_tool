import { AccountOrchestrationService } from 'services/account/AccountOrchestrationService';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import { IDatabaseConnection } from 'interfaces/IDatabaseConnection';
import AccountServiceBuilder from 'services/account/AccountServiceBuilder';
import BalanceServiceBuilder from 'services/balance/BalanceServiceBuilder';
import CurrencyServiceBuilder from 'services/currency/CurrencyServiceBuilder';
import TransactionServiceBuilder from 'services/transaction/TransactionServiceBuilder';

export class AccountOrchestrationServiceBuilder {
    public static build(db?: IDatabaseConnection): AccountOrchestrationService {
        const databaseConnection = db ?? DatabaseConnectionBuilder.build();
        return new AccountOrchestrationService({
            accountService: AccountServiceBuilder.build(databaseConnection),
            balanceService: BalanceServiceBuilder.build(databaseConnection),
            currencyService: CurrencyServiceBuilder.build(databaseConnection),
            transactionService: TransactionServiceBuilder.build(databaseConnection),
        });
    }
}
