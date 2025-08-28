import UserRegistrationService from 'src/services/registration/UserRegistrationService';
import EmailConfirmationDataAccess from 'src/services/emailConfirmation/EmailConfirmationDataAccess';

import UserServiceBuilder from 'src/services/user/UserServiceBuilder';
import AccountServiceBuilder from 'services/account/AccountServiceBuilder';
import CategoryServiceBuilder from 'services/category/CategoryServiceBuilder';
import GroupServiceBuilder from 'services/group/GroupServiceBuilder';
import IncomeServiceBuilder from 'services/income/IncomeServiceBuilder';
import UserRoleServiceBuilder from 'services/userRole/UserRoleServiceBuilder';
import ProfileServiceBuilder from 'services/profile/ProfileServiceBuilder';
import CurrencyServiceBuilder from 'services/currency/CurrencyServiceBuilder';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import MailService from 'services/mail/MailService';
import MailTemplateService from 'services/mailTamplate/MailTemplateService';
import EmailConfirmationService from 'services/emailConfirmation/EmailConfirmationService';
import BalanceServiceBuilder from 'services/balance/BalanceServiceBuilder';
import { KeyValueStoreBuilder } from 'src/repositories/keyValueStore/KeyValueStoreBuilder';

export default class UserRegistrationServiceBuilder {
    public static build() {
        const databaseConnection = DatabaseConnectionBuilder.build();
        return new UserRegistrationService({
            userService: UserServiceBuilder.build(),
            accountService: AccountServiceBuilder.build(),
            categoryService: CategoryServiceBuilder.build(),
            groupService: GroupServiceBuilder.build(),
            incomeService: IncomeServiceBuilder.build(),
            mailService: new MailService(),
            mailTemplateService: new MailTemplateService(),
            userRoleService: UserRoleServiceBuilder.build(),
            profileService: ProfileServiceBuilder.build(),
            currencyService: CurrencyServiceBuilder.build(),
            balanceService: BalanceServiceBuilder.build(),
            keyValueStore: KeyValueStoreBuilder.build(),
            emailConfirmationService: new EmailConfirmationService(
                new EmailConfirmationDataAccess(databaseConnection),
                new MailService(),
                new MailTemplateService(),
                UserServiceBuilder.build(),
            ),
            db: databaseConnection,
        });
    }
}
