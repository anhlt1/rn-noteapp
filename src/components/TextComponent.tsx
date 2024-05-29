import React from "react";
import { Text, StyleProp, TextStyle } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";

interface Props {
  text: string;
  size?: number;
  font?: string;
  color?: string;
  flex?: number;
  styles?: StyleProp<TextStyle>;
  line?: number;
}

const TextComponent = (props: Props) => {
  const { text, font, size, color, flex, styles, line } = props;
  const weight: any = {
    fontWeight: font ? font : "normal",
  };
  return (
    <Text
      numberOfLines={line ?? 1}
      style={[
        globalStyles.text,
        weight,
        {
          flex: flex ?? 0,
          fontSize: size ?? 16,
          color: color ?? colors.text,
        },
        styles,
      ]}
    >
      {text}
    </Text>
  );
};

export default TextComponent;
