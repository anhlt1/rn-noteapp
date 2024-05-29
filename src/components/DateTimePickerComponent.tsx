import { View } from "react-native";
import React, { useState } from "react";
import TitleComponent from "./TitleComponent";
import RowComponent from "./RowComponent";
import TextComponent from "./TextComponent";
import { colors } from "../constants/colors";
import { ArrowDown2 } from "iconsax-react-native";
import { globalStyles } from "../styles/globalStyles";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
  type?: "date" | "time" | "datetime";
  title?: string;
  placeholder?: string;
  selected?: any;
  onSelect: (val: Date) => void;
}

const DateTimePickerComponent = (props: Props) => {
  const { selected, onSelect, placeholder, title, type } = props;
  const [showPicker, setshowPicker] = useState(false);
  const [date, setDate] = useState(selected ?? new Date());
  return (
    <>
      <View style={{ marginBottom: 16 }}>
        {title && <TitleComponent text={title} />}
        <RowComponent
          onPress={() => setshowPicker(true)}
          styles={[
            globalStyles.inputContainer,
            { marginTop: title ? 8 : 0, paddingVertical: 16 },
          ]}
        >
          <TextComponent
            flex={1}
            text={
              selected
                ? type === "time"
                  ? `${selected.getHours()}:${selected.getMinutes()}`
                  : `${selected.getDate()}/${
                      selected.getMonth() + 1
                    }/${selected.getFullYear()}`
                : placeholder
                ? placeholder
                : ""
            }
            color={selected ? colors.text : "#676767"}
          />
          <ArrowDown2 size={20} color={colors.text} />
        </RowComponent>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={type ? type : "datetime"}
          display="spinner"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            onSelect(currentDate);
            setTimeout(() => {
              setshowPicker(false);
            }, 100);
          }}
        />
      )}
    </>
  );
};

export default DateTimePickerComponent;
