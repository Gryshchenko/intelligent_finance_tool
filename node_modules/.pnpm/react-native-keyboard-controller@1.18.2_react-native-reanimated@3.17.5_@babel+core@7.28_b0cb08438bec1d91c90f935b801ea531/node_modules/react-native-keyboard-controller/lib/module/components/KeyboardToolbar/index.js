function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FocusedInputEvents } from "../../bindings";
import { useKeyboardState } from "../../hooks";
import { KeyboardController } from "../../module";
import KeyboardStickyView from "../KeyboardStickyView";
import Arrow from "./Arrow";
import Button from "./Button";
import { colors } from "./colors";
import { DEFAULT_OPACITY, KEYBOARD_HAS_ROUNDED_CORNERS, KEYBOARD_TOOLBAR_HEIGHT, OPENED_OFFSET, TEST_ID_KEYBOARD_TOOLBAR, TEST_ID_KEYBOARD_TOOLBAR_CONTENT, TEST_ID_KEYBOARD_TOOLBAR_DONE, TEST_ID_KEYBOARD_TOOLBAR_NEXT, TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS } from "./constants";
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
    theme = colors,
    doneText = "Done",
    button,
    icon,
    showArrows = true,
    onNextCallback,
    onPrevCallback,
    onDoneCallback,
    blur = null,
    opacity = DEFAULT_OPACITY,
    offset: {
      closed = 0,
      opened = 0
    } = {},
    enabled = true,
    insets,
    ...rest
  } = props;
  const colorScheme = useKeyboardState(state => state.appearance);
  const [inputs, setInputs] = useState({
    current: 0,
    count: 0
  });
  const isPrevDisabled = inputs.current === 0;
  const isNextDisabled = inputs.current === inputs.count - 1;
  useEffect(() => {
    const subscription = FocusedInputEvents.addListener("focusDidSet", e => {
      setInputs(e);
    });
    return subscription.remove;
  }, []);
  const doneStyle = useMemo(() => [styles.doneButton, {
    color: theme[colorScheme].primary
  }], [colorScheme, theme]);
  const toolbarStyle = useMemo(() => [styles.toolbar, {
    backgroundColor: `${theme[colorScheme].background}${opacity}`
  }, !KEYBOARD_HAS_ROUNDED_CORNERS ? {
    paddingLeft: insets === null || insets === void 0 ? void 0 : insets.left,
    paddingRight: insets === null || insets === void 0 ? void 0 : insets.right
  } : null, KEYBOARD_HAS_ROUNDED_CORNERS ? styles.floating : null], [colorScheme, opacity, theme, insets]);
  const containerStyle = useMemo(() => [KEYBOARD_HAS_ROUNDED_CORNERS ? {
    marginLeft: ((insets === null || insets === void 0 ? void 0 : insets.left) ?? 0) + 16,
    marginRight: ((insets === null || insets === void 0 ? void 0 : insets.right) ?? 0) + 16
  } : null], [insets]);
  const offset = useMemo(() => ({
    closed: closed + KEYBOARD_TOOLBAR_HEIGHT,
    opened: opened + OPENED_OFFSET
  }), [closed, opened]);
  const ButtonContainer = button || Button;
  const IconContainer = icon || Arrow;
  const onPressNext = useCallback(event => {
    onNextCallback === null || onNextCallback === void 0 || onNextCallback(event);
    if (!event.isDefaultPrevented()) {
      KeyboardController.setFocusTo("next");
    }
  }, [onNextCallback]);
  const onPressPrev = useCallback(event => {
    onPrevCallback === null || onPrevCallback === void 0 || onPrevCallback(event);
    if (!event.isDefaultPrevented()) {
      KeyboardController.setFocusTo("prev");
    }
  }, [onPrevCallback]);
  const onPressDone = useCallback(event => {
    onDoneCallback === null || onDoneCallback === void 0 || onDoneCallback(event);
    if (!event.isDefaultPrevented()) {
      KeyboardController.dismiss();
    }
  }, [onDoneCallback]);
  return /*#__PURE__*/React.createElement(KeyboardStickyView, {
    enabled: enabled,
    offset: offset,
    style: containerStyle
  }, /*#__PURE__*/React.createElement(View, _extends({}, rest, {
    style: toolbarStyle,
    testID: TEST_ID_KEYBOARD_TOOLBAR
  }), blur, showArrows && /*#__PURE__*/React.createElement(View, {
    style: styles.arrows
  }, /*#__PURE__*/React.createElement(ButtonContainer, {
    accessibilityHint: "Moves focus to the previous field",
    accessibilityLabel: "Previous",
    disabled: isPrevDisabled,
    testID: TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS,
    theme: theme,
    onPress: onPressPrev
  }, /*#__PURE__*/React.createElement(IconContainer, {
    disabled: isPrevDisabled,
    theme: theme,
    type: "prev"
  })), /*#__PURE__*/React.createElement(ButtonContainer, {
    accessibilityHint: "Moves focus to the next field",
    accessibilityLabel: "Next",
    disabled: isNextDisabled,
    testID: TEST_ID_KEYBOARD_TOOLBAR_NEXT,
    theme: theme,
    onPress: onPressNext
  }, /*#__PURE__*/React.createElement(IconContainer, {
    disabled: isNextDisabled,
    theme: theme,
    type: "next"
  }))), /*#__PURE__*/React.createElement(View, {
    style: styles.flex,
    testID: TEST_ID_KEYBOARD_TOOLBAR_CONTENT
  }, content), doneText && /*#__PURE__*/React.createElement(ButtonContainer, {
    accessibilityHint: "Closes the keyboard",
    accessibilityLabel: "Done",
    rippleRadius: 28,
    style: styles.doneButtonContainer,
    testID: TEST_ID_KEYBOARD_TOOLBAR_DONE,
    theme: theme,
    onPress: onPressDone
  }, /*#__PURE__*/React.createElement(Text, {
    maxFontSizeMultiplier: 1.3,
    style: doneStyle
  }, doneText))));
};
const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    height: KEYBOARD_TOOLBAR_HEIGHT
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
export { colors as DefaultKeyboardToolbarTheme };
export default KeyboardToolbar;
//# sourceMappingURL=index.js.map