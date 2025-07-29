import type { Configuration, Listener, MMKVInterface } from './Types';
/**
 * A single MMKV instance.
 */
export declare class MMKV implements MMKVInterface {
    private nativeInstance;
    private functionCache;
    private id;
    /**
     * Creates a new MMKV instance with the given Configuration.
     * If no custom `id` is supplied, `'mmkv.default'` will be used.
     */
    constructor(configuration?: Configuration);
    private get onValueChangedListeners();
    private getFunctionFromCache;
    private onValuesChanged;
    get size(): number;
    get isReadOnly(): boolean;
    set(key: string, value: boolean | string | number | ArrayBuffer): void;
    getBoolean(key: string): boolean | undefined;
    getString(key: string): string | undefined;
    getNumber(key: string): number | undefined;
    getBuffer(key: string): ArrayBufferLike | undefined;
    contains(key: string): boolean;
    delete(key: string): void;
    getAllKeys(): string[];
    clearAll(): void;
    recrypt(key: string | undefined): void;
    trim(): void;
    toString(): string;
    toJSON(): object;
    addOnValueChangedListener(onValueChanged: (key: string) => void): Listener;
}
//# sourceMappingURL=MMKV.d.ts.map