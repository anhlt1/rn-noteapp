import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { globalStyles } from "../styles/globalStyles";

interface Props {
  children: React.ReactNode;
  justify?:
    | "space-between"
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-around"
    | "space-evenly"
    | undefined;
  onPress?: () => void;
  styles?: StyleProp<ViewStyle>;
}

const RowComponent = (props: Props) => {
  const { children, justify, onPress, styles } = props;
  // style dùng chung cho cả nút touchable và view
  const localStyle = [
    globalStyles.row,
    {
      justifyContent: justify ?? "center",
    },
    styles,
  ];
  return onPress ? (
    <TouchableOpacity
      style={localStyle}
      onPress={onPress ? () => onPress() : undefined}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <View style={localStyle}>{children}</View>
  );
};

export default RowComponent;
