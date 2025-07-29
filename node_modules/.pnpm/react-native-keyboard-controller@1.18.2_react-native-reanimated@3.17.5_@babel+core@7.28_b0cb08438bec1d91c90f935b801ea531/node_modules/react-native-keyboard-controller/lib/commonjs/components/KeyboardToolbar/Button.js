"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _hooks = require("../../hooks");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ButtonIOS = ({
  children,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style
}) => {
  // immediately switch to plain view to avoid animation flickering
  // when fade out animation happens and view becomes disabled
  const Container = disabled ? _reactNative.View : _reactNative.TouchableOpacity;
  const accessibilityState = (0, _react.useMemo)(() => ({
    disabled
  }), [disabled]);
  return /*#__PURE__*/_react.default.createElement(Container, {
    accessibilityHint: accessibilityHint,
    accessibilityLabel: accessibilityLabel,
    accessibilityRole: "button",
    accessibilityState: accessibilityState,
    style: style,
    testID: testID,
    onPress: onPress
  }, children);
};
const ButtonAndroid = ({
  children,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
  rippleRadius = 18,
  style,
  theme
}) => {
  const colorScheme = (0, _hooks.useKeyboardState)(state => state.appearance);
  const accessibilityState = (0, _react.useMemo)(() => ({
    disabled
  }), [disabled]);
  const ripple = (0, _react.useMemo)(() => _reactNative.TouchableNativeFeedback.Ripple(theme[colorScheme].ripple, true, rippleRadius), [colorScheme, rippleRadius, theme]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableNativeFeedback, {
    accessibilityHint: accessibilityHint,
    accessibilityLabel: accessibilityLabel,
    accessibilityRole: "button",
    accessibilityState: accessibilityState,
    background: ripple,
    style: style,
    testID: testID,
    onPress: onPress
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: style
  }, children));
};
var _default = exports.default = _reactNative.Platform.select({
  android: ButtonAndroid,
  default: ButtonIOS
});
//# sourceMappingURL=Button.js.map