import { IKeyValueStore, KeyValueStore } from 'src/repositories/keyValueStore/KeyValueStore';
import { getConfig } from 'src/config/config';

export class KeyValueStoreBuilder {
    public static build(): IKeyValueStore {
        return KeyValueStore.instance({
            url: getConfig().redisHost,
            port: Number(getConfig().redisPort),
            prefix: getConfig().redisPrefix,
        });
    }
}
