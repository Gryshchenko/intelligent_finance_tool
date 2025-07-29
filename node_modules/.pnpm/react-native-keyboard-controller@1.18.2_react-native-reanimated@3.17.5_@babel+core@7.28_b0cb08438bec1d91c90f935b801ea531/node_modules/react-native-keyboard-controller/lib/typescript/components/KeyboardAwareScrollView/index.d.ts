import React from "react";
import type { ScrollView, ScrollViewProps } from "react-native";
export type KeyboardAwareScrollViewProps = {
    /** The distance between the keyboard and the caret inside a focused `TextInput` when the keyboard is shown. Default is `0`. */
    bottomOffset?: number;
    /** Prevents automatic scrolling of the `ScrollView` when the keyboard gets hidden, maintaining the current screen position. Default is `false`. */
    disableScrollOnKeyboardHide?: boolean;
    /** Controls whether this `KeyboardAwareScrollView` instance should take effect. Default is `true`. */
    enabled?: boolean;
    /** Adjusting the bottom spacing of KeyboardAwareScrollView. Default is `0`. */
    extraKeyboardSpace?: number;
    /** Custom component for `ScrollView`. Default is `ScrollView`. */
    ScrollViewComponent?: React.ComponentType<ScrollViewProps>;
} & ScrollViewProps;
/**
 * A ScrollView component that automatically handles keyboard appearance and disappearance
 * by adjusting its content position to ensure the focused input remains visible.
 *
 * The component uses a sophisticated animation system to smoothly handle keyboard transitions
 * and maintain proper scroll position during keyboard interactions.
 *
 * @returns A ScrollView component that handles keyboard interactions.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardAwareScrollView bottomOffset={20}>
 *   <TextInput placeholder="Enter text" />
 *   <TextInput placeholder="Another input" />
 * </KeyboardAwareScrollView>
 * ```
 */
declare const KeyboardAwareScrollView: React.ForwardRefExoticComponent<{
    /** The distance between the keyboard and the caret inside a focused `TextInput` when the keyboard is shown. Default is `0`. */
    bottomOffset?: number;
    /** Prevents automatic scrolling of the `ScrollView` when the keyboard gets hidden, maintaining the current screen position. Default is `false`. */
    disableScrollOnKeyboardHide?: boolean;
    /** Controls whether this `KeyboardAwareScrollView` instance should take effect. Default is `true`. */
    enabled?: boolean;
    /** Adjusting the bottom spacing of KeyboardAwareScrollView. Default is `0`. */
    extraKeyboardSpace?: number;
    /** Custom component for `ScrollView`. Default is `ScrollView`. */
    ScrollViewComponent?: React.ComponentType<ScrollViewProps>;
} & ScrollViewProps & {
    children?: React.ReactNode | undefined;
} & React.RefAttributes<ScrollView>>;
export default KeyboardAwareScrollView;
