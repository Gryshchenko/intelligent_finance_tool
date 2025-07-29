import React from "react";
type KeyboardProviderProps = {
    children: React.ReactNode;
    /**
     * Set the value to `true`, if you use translucent status bar on Android.
     * If you already control status bar translucency via `react-native-screens`
     * or `StatusBar` component from `react-native`, you can ignore it.
     * Defaults to `false`.
     *
     * @platform android
     * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/14
     */
    statusBarTranslucent?: boolean;
    /**
     * Set the value to `true`, if you use translucent navigation bar on Android.
     * Defaults to `false`.
     *
     * @platform android
     * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/119
     */
    navigationBarTranslucent?: boolean;
    /**
     * A boolean property indicating whether to keep edge-to-edge mode always enabled (even when you disable the module).
     * Defaults to `false`.
     *
     * @platform android
     * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/592
     */
    preserveEdgeToEdge?: boolean;
    /**
     * A boolean prop indicating whether the module is enabled. It indicate only initial state
     * (if you try to change this prop after component mount it will not have any effect).
     * To change the property in runtime use `useKeyboardController` hook and `setEnabled` method.
     * Defaults to `true`.
     */
    enabled?: boolean;
    /**
     * A boolean prop indicating whether to preload the keyboard to reduce time-to-interaction (TTI) on first input focus.
     * Defaults to `true`.
     *
     * @platform ios
     */
    preload?: boolean;
};
/**
 * A component that wrap your app. Under the hood it works with {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-controller-view|KeyboardControllerView} to receive events during keyboard movements,
 * maps these events to `Animated`/`Reanimated` values and store them in context.
 *
 * @param props - Provider props, such as `statusBarTranslucent`, `navigationBarTranslucent`, etc.
 * @returns A component that should be mounted in root of your App layout.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-provider|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardProvider>
 *   <NavigationContainer />
 * </KeyboardProvider>
 * ```
 */
export declare const KeyboardProvider: (props: KeyboardProviderProps) => React.JSX.Element;
export {};
