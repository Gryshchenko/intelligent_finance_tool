import AccountServiceBuilder from 'services/account/AccountServiceBuilder';
import CategoryServiceBuilder from 'services/category/CategoryServiceBuilder';
import IncomeServiceBuilder from 'services/income/IncomeServiceBuilder';
import OverviewService from 'services/overview/OverviewService';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';

export default class OverviewServiceBuilder {
    public static build() {
        const db = DatabaseConnectionBuilder.build();
        return new OverviewService({
            accountService: AccountServiceBuilder.build(db),
            categoryService: CategoryServiceBuilder.build(db),
            incomeService: IncomeServiceBuilder.build(db),
        });
    }
}
