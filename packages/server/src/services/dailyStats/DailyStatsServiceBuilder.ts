import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import { IDatabaseConnection } from 'interfaces/IDatabaseConnection';
import DailyStatsService from 'services/dailyStats/DailyStatsService';
import DailyStatsDataAccess from 'services/dailyStats/DailyStatsDataAccess';

export default class DailyStatsServiceBuilder {
    public static build(db?: IDatabaseConnection): DailyStatsService {
        const databaseConnection = db ?? DatabaseConnectionBuilder.build();
        return new DailyStatsService(new DailyStatsDataAccess(databaseConnection));
    }
}
