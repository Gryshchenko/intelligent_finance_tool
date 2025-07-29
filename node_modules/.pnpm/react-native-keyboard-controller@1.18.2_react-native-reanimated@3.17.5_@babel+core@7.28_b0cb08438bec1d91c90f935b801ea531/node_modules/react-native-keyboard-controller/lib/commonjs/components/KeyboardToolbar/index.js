"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultKeyboardToolbarTheme", {
  enumerable: true,
  get: function () {
    return _colors.colors;
  }
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _bindings = require("../../bindings");
var _hooks = require("../../hooks");
var _module = require("../../module");
var _KeyboardStickyView = _interopRequireDefault(require("../KeyboardStickyView"));
var _Arrow = _interopRequireDefault(require("./Arrow"));
var _Button = _interopRequireDefault(require("./Button"));
var _colors = require("./colors");
var _constants = require("./constants");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * `KeyboardToolbar` is a component that is shown above the keyboard with `Prev`/`Next` buttons from left and
 * `Done` button from the right (to dismiss the keyboard). Allows to add customizable content (yours UI elements) in the middle.
 *
 * @param props - Component props.
 * @returns A component that is shown above the keyboard with `Prev`/`Next` and `Done` buttons.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-toolbar|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardToolbar doneText="Close" />
 * ```
 */
const KeyboardToolbar = props => {
  const {
    content,
    theme = _colors.colors,
    doneText = "Done",
    button,
    icon,
    showArrows = true,
    onNextCallback,
    onPrevCallback,
    onDoneCallback,
    blur = null,
    opacity = _constants.DEFAULT_OPACITY,
    offset: {
      closed = 0,
      opened = 0
    } = {},
    enabled = true,
    insets,
    ...rest
  } = props;
  const colorScheme = (0, _hooks.useKeyboardState)(state => state.appearance);
  const [inputs, setInputs] = (0, _react.useState)({
    current: 0,
    count: 0
  });
  const isPrevDisabled = inputs.current === 0;
  const isNextDisabled = inputs.current === inputs.count - 1;
  (0, _react.useEffect)(() => {
    const subscription = _bindings.FocusedInputEvents.addListener("focusDidSet", e => {
      setInputs(e);
    });
    return subscription.remove;
  }, []);
  const doneStyle = (0, _react.useMemo)(() => [styles.doneButton, {
    color: theme[colorScheme].primary
  }], [colorScheme, theme]);
  const toolbarStyle = (0, _react.useMemo)(() => [styles.toolbar, {
    backgroundColor: `${theme[colorScheme].background}${opacity}`
  }, !_constants.KEYBOARD_HAS_ROUNDED_CORNERS ? {
    paddingLeft: insets === null || insets === void 0 ? void 0 : insets.left,
    paddingRight: insets === null || insets === void 0 ? void 0 : insets.right
  } : null, _constants.KEYBOARD_HAS_ROUNDED_CORNERS ? styles.floating : null], [colorScheme, opacity, theme, insets]);
  const containerStyle = (0, _react.useMemo)(() => [_constants.KEYBOARD_HAS_ROUNDED_CORNERS ? {
    marginLeft: ((insets === null || insets === void 0 ? void 0 : insets.left) ?? 0) + 16,
    marginRight: ((insets === null || insets === void 0 ? void 0 : insets.right) ?? 0) + 16
  } : null], [insets]);
  const offset = (0, _react.useMemo)(() => ({
    closed: closed + _constants.KEYBOARD_TOOLBAR_HEIGHT,
    opened: opened + _constants.OPENED_OFFSET
  }), [closed, opened]);
  const ButtonContainer = button || _Button.default;
  const IconContainer = icon || _Arrow.default;
  const onPressNext = (0, _react.useCallback)(event => {
    onNextCallback === null || onNextCallback === void 0 || onNextCallback(event);
    if (!event.isDefaultPrevented()) {
      _module.KeyboardController.setFocusTo("next");
    }
  }, [onNextCallback]);
  const onPressPrev = (0, _react.useCallback)(event => {
    onPrevCallback === null || onPrevCallback === void 0 || onPrevCallback(event);
    if (!event.isDefaultPrevented()) {
      _module.KeyboardController.setFocusTo("prev");
    }
  }, [onPrevCallback]);
  const onPressDone = (0, _react.useCallback)(event => {
    onDoneCallback === null || onDoneCallback === void 0 || onDoneCallback(event);
    if (!event.isDefaultPrevented()) {
      _module.KeyboardController.dismiss();
    }
  }, [onDoneCallback]);
  return /*#__PURE__*/_react.default.createElement(_KeyboardStickyView.default, {
    enabled: enabled,
    offset: offset,
    style: containerStyle
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({}, rest, {
    style: toolbarStyle,
    testID: _constants.TEST_ID_KEYBOARD_TOOLBAR
  }), blur, showArrows && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.arrows
  }, /*#__PURE__*/_react.default.createElement(ButtonContainer, {
    accessibilityHint: "Moves focus to the previous field",
    accessibilityLabel: "Previous",
    disabled: isPrevDisabled,
    testID: _constants.TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS,
    theme: theme,
    onPress: onPressPrev
  }, /*#__PURE__*/_react.default.createElement(IconContainer, {
    disabled: isPrevDisabled,
    theme: theme,
    type: "prev"
  })), /*#__PURE__*/_react.default.createElement(ButtonContainer, {
    accessibilityHint: "Moves focus to the next field",
    accessibilityLabel: "Next",
    disabled: isNextDisabled,
    testID: _constants.TEST_ID_KEYBOARD_TOOLBAR_NEXT,
    theme: theme,
    onPress: onPressNext
  }, /*#__PURE__*/_react.default.createElement(IconContainer, {
    disabled: isNextDisabled,
    theme: theme,
    type: "next"
  }))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.flex,
    testID: _constants.TEST_ID_KEYBOARD_TOOLBAR_CONTENT
  }, content), doneText && /*#__PURE__*/_react.default.createElement(ButtonContainer, {
    accessibilityHint: "Closes the keyboard",
    accessibilityLabel: "Done",
    rippleRadius: 28,
    style: styles.doneButtonContainer,
    testID: _constants.TEST_ID_KEYBOARD_TOOLBAR_DONE,
    theme: theme,
    onPress: onPressDone
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    maxFontSizeMultiplier: 1.3,
    style: doneStyle
  }, doneText))));
};
const styles = _reactNative.StyleSheet.create({
  flex: {
    flex: 1
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    height: _constants.KEYBOARD_TOOLBAR_HEIGHT
  },
  arrows: {
    flexDirection: "row",
    paddingLeft: 8
  },
  doneButton: {
    fontWeight: "600",
    fontSize: 15
  },
  doneButtonContainer: {
    marginRight: 16,
    marginLeft: 8
  },
  floating: {
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden"
  }
});
var _default = exports.default = KeyboardToolbar;
//# sourceMappingURL=index.js.map