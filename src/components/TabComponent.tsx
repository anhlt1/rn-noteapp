import React from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import TextComponent from "./TextComponent";
import { globalStyles } from "../styles/globalStyles";

interface Props {
  text: string;
  color?: string;
  tagStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const TabComponent = (props: Props) => {
  const { text, color, tagStyle, textStyle, onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[globalStyles.tag, tagStyle]}
    >
      <TextComponent text={text} styles={textStyle}></TextComponent>
    </TouchableOpacity>
  );
};

export default TabComponent;
