import IncomeService from 'services/income/IncomeService';
import IncomeDataAccess from 'services/income/IncomeDataAccess';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import { IDatabaseConnection } from 'interfaces/IDatabaseConnection';

export default class IncomeServiceBuilder {
    public static build(db?: IDatabaseConnection) {
        return new IncomeService(new IncomeDataAccess(db ?? DatabaseConnectionBuilder.build()));
    }
}
