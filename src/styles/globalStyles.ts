import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../constants/colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingTop: 45,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: colors.text,
    fontSize: 14,
  },

  section: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  inputContainer: {
    backgroundColor: colors.gray,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  tag: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: colors.blue,
  },

  card: {
    borderRadius: 12,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  documentImg: {
    marginHorizontal: 4,
  },

  modal: {
    flex: 0,
  },

  modalContainer: {
    padding: 20,
    flex: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: Dimensions.get("window").width * 0.8,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
});
