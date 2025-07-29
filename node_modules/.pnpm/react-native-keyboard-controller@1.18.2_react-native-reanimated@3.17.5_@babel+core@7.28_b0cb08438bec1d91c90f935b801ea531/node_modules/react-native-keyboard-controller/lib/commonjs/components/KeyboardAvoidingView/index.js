"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _hooks = require("../../hooks");
var _hooks2 = require("./hooks");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const defaultLayout = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

/**
 * A View component that automatically adjusts its height, position, or bottom padding
 * when the keyboard appears to ensure that the content remains visible.
 *
 * @returns A View component that adjusts to keyboard visibility.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardAvoidingView behavior="padding">
 *   <TextInput />
 * </KeyboardAvoidingView>
 * ```
 */
const KeyboardAvoidingView = /*#__PURE__*/(0, _react.forwardRef)(({
  behavior,
  children,
  contentContainerStyle,
  enabled = true,
  keyboardVerticalOffset = 0,
  style,
  onLayout: onLayoutProps,
  ...props
}, ref) => {
  const initialFrame = (0, _reactNativeReanimated.useSharedValue)(null);
  const frame = (0, _reactNativeReanimated.useDerivedValue)(() => initialFrame.value || defaultLayout);
  const {
    translate,
    padding
  } = (0, _hooks2.useTranslateAnimation)();
  const keyboard = (0, _hooks2.useKeyboardAnimation)();
  const {
    height: screenHeight
  } = (0, _hooks.useWindowDimensions)();
  const relativeKeyboardHeight = (0, _react.useCallback)(() => {
    "worklet";

    const keyboardY = screenHeight - keyboard.heightWhenOpened.value - keyboardVerticalOffset;
    return Math.max(frame.value.y + frame.value.height - keyboardY, 0);
  }, [screenHeight, keyboardVerticalOffset]);
  const interpolateToRelativeKeyboardHeight = (0, _react.useCallback)(value => {
    "worklet";

    return (0, _reactNativeReanimated.interpolate)(value, [0, 1], [0, relativeKeyboardHeight()]);
  }, [relativeKeyboardHeight]);
  const onLayoutWorklet = (0, _react.useCallback)(layout => {
    "worklet";

    if (keyboard.isClosed.value || initialFrame.value === null || behavior !== "height") {
      // eslint-disable-next-line react-compiler/react-compiler
      initialFrame.value = layout;
    }
  }, [behavior]);
  const onLayout = (0, _react.useCallback)(e => {
    (0, _reactNativeReanimated.runOnUI)(onLayoutWorklet)(e.nativeEvent.layout);
    onLayoutProps === null || onLayoutProps === void 0 || onLayoutProps(e);
  }, [onLayoutProps]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const bottom = interpolateToRelativeKeyboardHeight(keyboard.progress.value);
    const translateY = interpolateToRelativeKeyboardHeight(translate.value);
    const paddingBottom = interpolateToRelativeKeyboardHeight(padding.value);
    const bottomHeight = enabled ? bottom : 0;
    const height = frame.value.height - bottomHeight;
    switch (behavior) {
      case "height":
        if (!keyboard.isClosed.value && height > 0) {
          return {
            height,
            flex: 0
          };
        }
        return {};
      case "position":
        return {
          bottom: bottomHeight
        };
      case "padding":
        return {
          paddingBottom: bottomHeight
        };
      case "translate-with-padding":
        return {
          paddingTop: paddingBottom,
          transform: [{
            translateY: -translateY
          }]
        };
      default:
        return {};
    }
  }, [behavior, enabled, interpolateToRelativeKeyboardHeight]);
  const isPositionBehavior = behavior === "position";
  const containerStyle = isPositionBehavior ? contentContainerStyle : style;
  const combinedStyles = (0, _react.useMemo)(() => [containerStyle, animatedStyle], [containerStyle, animatedStyle]);
  if (isPositionBehavior) {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({
      ref: ref,
      style: style,
      onLayout: onLayout
    }, props), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
      style: combinedStyles
    }, children));
  }
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, _extends({
    ref: ref,
    style: combinedStyles,
    onLayout: onLayout
  }, props), children);
});
var _default = exports.default = KeyboardAvoidingView;
//# sourceMappingURL=index.js.map