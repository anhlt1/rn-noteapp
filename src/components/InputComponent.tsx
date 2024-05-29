import React, { ReactNode, useState } from "react";
import {
  KeyboardTypeOptions,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";
import RowComponent from "./RowComponent";
import TitleComponent from "./TitleComponent";
import { Eye, EyeSlash } from "iconsax-react-native";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  title?: string;
  prefix?: ReactNode; //icon
  affix?: ReactNode; //icon
  allowClear?: boolean; //xóa nội dung
  multible?: boolean; //nhiều dòng
  numberOfLine?: number; //số dòng
  type?: KeyboardTypeOptions; //kiểu bàn phím
  isPassword?: boolean;
  color?: string;
}

const InputComponent = (props: Props) => {
  const {
    value,
    onChange,
    placeholder,
    title,
    prefix,
    affix,
    allowClear,
    multible,
    numberOfLine,
    type,
    isPassword,
    color,
  } = props;

  const [showPass, setShowPass] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {title && <TitleComponent text={title} />}
      <RowComponent
        styles={[
          globalStyles.inputContainer,
          {
            marginTop: 0,
            minHeight: multible && numberOfLine ? 32 * numberOfLine : 32,
            paddingVertical: 14,
            paddingHorizontal: 10,
            alignItems: multible ? "flex-start" : "center",
            backgroundColor: color ?? colors.gray,
          },
        ]}
      >
        {prefix && prefix}
        <View
          style={{
            flex: 1,
            paddingLeft: prefix ? 8 : 0,
            paddingRight: affix ? 8 : 0,
          }}
        >
          <TextInput
            style={[
              globalStyles.text,
              { margin: 0, padding: 0, paddingVertical: 6 },
            ]}
            placeholder={placeholder ?? ""}
            placeholderTextColor={"#676767"}
            value={value}
            onChangeText={(val) => onChange(val)}
            multiline={multible}
            numberOfLines={numberOfLine}
            keyboardType={type}
            secureTextEntry={isPassword ? !showPass : false}
            autoCapitalize="none"
          />
        </View>
        {affix && affix}

        {allowClear && value && (
          <TouchableOpacity onPress={() => onChange("")}>
            <AntDesign name="close" size={20} color={colors.white} />
          </TouchableOpacity>
        )}

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            {showPass ? (
              <EyeSlash size={20} color={colors.desc} />
            ) : (
              <Eye size={20} color={colors.desc} />
            )}
          </TouchableOpacity>
        )}
      </RowComponent>
    </View>
  );
};

export default InputComponent;
