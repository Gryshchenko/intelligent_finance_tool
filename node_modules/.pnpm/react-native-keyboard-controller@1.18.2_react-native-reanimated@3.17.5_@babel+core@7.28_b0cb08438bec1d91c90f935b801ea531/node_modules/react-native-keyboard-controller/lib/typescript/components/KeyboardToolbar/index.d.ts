import React from "react";
import Arrow from "./Arrow";
import Button from "./Button";
import { colors } from "./colors";
import type { HEX, KeyboardToolbarTheme } from "./types";
import type { KeyboardStickyViewProps } from "../KeyboardStickyView";
import type { ReactNode } from "react";
import type { GestureResponderEvent, ViewProps } from "react-native";
type SafeAreaInsets = {
    left: number;
    right: number;
};
export type KeyboardToolbarProps = Omit<ViewProps, "style" | "testID" | "children"> & {
    /** An element that is shown in the middle of the toolbar. */
    content?: React.JSX.Element | null;
    /** A set of dark/light colors consumed by toolbar component. */
    theme?: KeyboardToolbarTheme;
    /** Custom text for done button. */
    doneText?: ReactNode;
    /** Custom touchable component for toolbar (used for prev/next/done buttons). */
    button?: typeof Button;
    /** Custom icon component used to display next/prev buttons. */
    icon?: typeof Arrow;
    /**
     * Whether to show next and previous buttons. Can be useful to set it to `false` if you have only one input
     * and want to show only `Done` button. Default to `true`.
     */
    showArrows?: boolean;
    /**
     * A callback that is called when the user presses the next button along with the default action.
     */
    onNextCallback?: (event: GestureResponderEvent) => void;
    /**
     * A callback that is called when the user presses the previous button along with the default action.
     */
    onPrevCallback?: (event: GestureResponderEvent) => void;
    /**
     * A callback that is called when the user presses the done button along with the default action.
     */
    onDoneCallback?: (event: GestureResponderEvent) => void;
    /**
     * A component that applies blur effect to the toolbar.
     */
    blur?: React.JSX.Element | null;
    /**
     * A value for container opacity in hexadecimal format (e.g. `ff`). Default value is `ff`.
     */
    opacity?: HEX;
    /**
     * A object containing `left`/`right` properties. Used to specify proper container padding in landscape mode.
     */
    insets?: SafeAreaInsets;
} & Pick<KeyboardStickyViewProps, "offset" | "enabled">;
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
declare const KeyboardToolbar: React.FC<KeyboardToolbarProps>;
export { colors as DefaultKeyboardToolbarTheme };
export default KeyboardToolbar;
