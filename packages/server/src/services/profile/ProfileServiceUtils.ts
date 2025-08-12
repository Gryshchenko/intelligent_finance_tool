import { IProfile } from 'interfaces/IProfile';
import { IProfileClient } from 'tenpercent/shared/src/interfaces/IProfileClient';

export default class ProfileServiceUtils {
    public static convertServerUserToClientUser(profile: Partial<IProfile> | undefined = {}): IProfileClient {
        return {
            publicName: profile.publicName,
            currencyId: profile.currencyId,
            locale: profile.locale,
            mailConfirmed: profile.mailConfirmed,
            additionInfo: profile.additionInfo,
        };
    }
}
