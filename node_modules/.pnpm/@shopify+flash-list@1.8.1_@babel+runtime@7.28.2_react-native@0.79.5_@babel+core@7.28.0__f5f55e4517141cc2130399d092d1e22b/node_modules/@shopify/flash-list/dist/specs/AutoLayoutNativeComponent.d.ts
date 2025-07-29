/// <reference types="react-native/types/modules/Codegen" />
import type { ViewProps } from "react-native";
import type { Int32, Double, DirectEventHandler } from "react-native/Libraries/Types/CodegenTypes";
declare type BlankAreaEvent = Readonly<{
    offsetStart: Int32;
    offsetEnd: Int32;
}>;
interface NativeProps extends ViewProps {
    horizontal?: boolean;
    scrollOffset?: Double;
    windowSize?: Double;
    renderAheadOffset?: Double;
    enableInstrumentation?: boolean;
    disableAutoLayout?: boolean;
    onBlankAreaEvent?: DirectEventHandler<BlankAreaEvent>;
}
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;
//# sourceMappingURL=AutoLayoutNativeComponent.d.ts.map