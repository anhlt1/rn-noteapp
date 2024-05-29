import React, { Component } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";

interface Props {
  children: React.ReactNode;
  bgColor?: string;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const CardComponent = (props: Props) => {
  const { children, bgColor, styles, onPress } = props;
  return onPress ? (
    <TouchableOpacity
      onPress={onPress}
      style={[
        globalStyles.inputContainer,
        { padding: 12, backgroundColor: bgColor },
        styles,
      ]}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        globalStyles.inputContainer,
        { padding: 12, backgroundColor: bgColor },
        styles,
      ]}
    >
      {children}
    </View>
  );
};

export default CardComponent;
