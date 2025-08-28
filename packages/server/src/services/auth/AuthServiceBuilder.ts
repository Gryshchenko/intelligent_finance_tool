import AuthService from './AuthService';
import UserServiceBuilder from 'src/services/user/UserServiceBuilder';
import { KeyValueStoreBuilder } from 'src/repositories/keyValueStore/KeyValueStoreBuilder';

export default class AuthServiceBuilder {
    public static build() {
        return new AuthService({
            userService: UserServiceBuilder.build(),
            keyValueStore: KeyValueStoreBuilder.build(),
        });
    }
}
