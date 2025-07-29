"use strict";

import { TurboModuleRegistry } from 'react-native';
import { ModuleNotFoundError } from './ModuleNotFoundError';
let mmkvPlatformModule;
export function getMMKVPlatformContextTurboModule() {
  try {
    if (mmkvPlatformModule == null) {
      // 1. Get the TurboModule
      mmkvPlatformModule = TurboModuleRegistry.getEnforcing('MmkvPlatformContext');
    }
    return mmkvPlatformModule;
  } catch (e) {
    // TurboModule could not be found!
    throw new ModuleNotFoundError(e);
  }
}
//# sourceMappingURL=NativeMmkvPlatformContext.js.map