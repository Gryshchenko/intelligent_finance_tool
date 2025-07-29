"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockMMKV = void 0;
/* Mock MMKV instance for use in tests */
const createMockMMKV = () => {
  const storage = new Map();
  return {
    clearAll: () => storage.clear(),
    delete: key => storage.delete(key),
    set: (key, value) => storage.set(key, value),
    getString: key => {
      const result = storage.get(key);
      return typeof result === 'string' ? result : undefined;
    },
    getNumber: key => {
      const result = storage.get(key);
      return typeof result === 'number' ? result : undefined;
    },
    getBoolean: key => {
      const result = storage.get(key);
      return typeof result === 'boolean' ? result : undefined;
    },
    getBuffer: key => {
      const result = storage.get(key);
      return result instanceof ArrayBuffer ? result : undefined;
    },
    getAllKeys: () => Array.from(storage.keys()),
    contains: key => storage.has(key),
    recrypt: () => {
      console.warn('Encryption is not supported in mocked MMKV instances!');
    },
    size: 0,
    isReadOnly: false,
    trim: () => {
      // no-op
    }
  };
};
exports.createMockMMKV = createMockMMKV;
//# sourceMappingURL=createMMKV.mock.js.map