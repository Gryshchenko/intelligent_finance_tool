function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useMemo } from "react";
import { Animated } from "react-native";
import { useKeyboardAnimation } from "../../hooks";
/**
 * A View component that sticks to the keyboard and moves with it when it appears or disappears.
 * The view can be configured with custom offsets for both closed and open keyboard states.
 *
 * @returns An animated View component that sticks to the keyboard.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardStickyView offset={{ closed: 0, opened: 20 }}>
 *   <Button title="Submit" />
 * </KeyboardStickyView>
 * ```
 */
const KeyboardStickyView = /*#__PURE__*/forwardRef(({
  children,
  offset: {
    closed = 0,
    opened = 0
  } = {},
  style,
  enabled = true,
  ...props
}, ref) => {
  const {
    height,
    progress
  } = useKeyboardAnimation();
  const offset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [closed, opened]
  });
  const styles = useMemo(() => [{
    transform: [{
      translateY: enabled ? Animated.add(height, offset) : closed
    }]
  }, style], [closed, enabled, height, offset, style]);
  return /*#__PURE__*/React.createElement(Animated.View, _extends({
    ref: ref,
    style: styles
  }, props), children);
});
export default KeyboardStickyView;
//# sourceMappingURL=index.js.map