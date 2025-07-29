"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _bindings = require("../../bindings");
var _hooks = require("../../hooks");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * A view component that renders its children over the keyboard without closing the keyboard.
 * Acts similar to modal, but doesn't close the keyboard when it's visible.
 *
 * @param props - Component props.
 * @returns A view component that renders over the keyboard.
 * @example
 * ```tsx
 * <OverKeyboardView visible={true}>
 *   <Text>This will appear over the keyboard</Text>
 * </OverKeyboardView>
 * ```
 */
const OverKeyboardView = props => {
  const {
    children,
    visible
  } = props;
  const {
    height,
    width
  } = (0, _hooks.useWindowDimensions)();
  const inner = (0, _react.useMemo)(() => ({
    height,
    width
  }), [height, width]);
  const style = (0, _react.useMemo)(() => [styles.absolute,
  // On iOS - stretch view to full window dimensions to make yoga work
  _reactNative.Platform.OS === "ios" ? inner : undefined,
  // On Android - we are laid out by ShadowNode, so just stretch to full container
  _reactNative.Platform.OS === "android" ? styles.stretch : undefined], [inner]);
  return /*#__PURE__*/_react.default.createElement(_bindings.RCTOverKeyboardView, {
    visible: visible
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    collapsable: false,
    style: style
  }, visible && children));
};
const styles = _reactNative.StyleSheet.create({
  absolute: {
    position: "absolute"
  },
  stretch: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});
var _default = exports.default = OverKeyboardView;
//# sourceMappingURL=index.js.map