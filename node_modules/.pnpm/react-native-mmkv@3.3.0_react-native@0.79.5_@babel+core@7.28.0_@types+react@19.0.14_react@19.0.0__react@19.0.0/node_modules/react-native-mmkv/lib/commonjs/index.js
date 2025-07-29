"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Mode: true
};
Object.defineProperty(exports, "Mode", {
  enumerable: true,
  get: function () {
    return _Types.Mode;
  }
});
var _MMKV = require("./MMKV");
Object.keys(_MMKV).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _MMKV[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _MMKV[key];
    }
  });
});
var _hooks = require("./hooks");
Object.keys(_hooks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _hooks[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hooks[key];
    }
  });
});
var _Types = require("./Types");
//# sourceMappingURL=index.js.map