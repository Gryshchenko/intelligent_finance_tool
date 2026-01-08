import { ViewStyle } from "react-native";
import { TextProps } from "@/components/Text";
import { TxKeyPath } from "@/i18n";
export declare enum DatePickerType {
    Date = "date",
    Time = "time",
    Datetime = "datetime"
}
type IgniteDatePickerProps = {
    value: string | null;
    onChange: (date: Date) => void;
    placeholder?: string;
    mode?: DatePickerType;
    minimumDate?: Date;
    maximumDate?: Date;
    style?: ViewStyle;
    disabled?: boolean;
    helperTx?: TxKeyPath;
    status?: "error" | "disabled";
    HelperTextProps?: TextProps;
    helper?: string;
    helperTxOptions?: TextProps["txOptions"];
};
export declare const IgniteDatePicker: React.FC<IgniteDatePickerProps>;
export {};
