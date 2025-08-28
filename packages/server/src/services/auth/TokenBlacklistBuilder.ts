import { TokenBlacklist } from 'services/auth/TokenBlacklist';
import { KeyValueStoreBuilder } from 'src/repositories/keyValueStore/KeyValueStoreBuilder';

export default class TokenBlacklistBuilder {
    public static build() {
        return TokenBlacklist.instance(KeyValueStoreBuilder.build());
    }
}
