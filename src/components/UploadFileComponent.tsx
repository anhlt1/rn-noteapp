import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Attachment } from "../models/TaskModel";
import { DocumentUpload } from "iconsax-react-native";
import { colors } from "../constants/colors";
import TextComponent from "./TextComponent";
import { globalStyles } from "../styles/globalStyles";
import TitleComponent from "./TitleComponent";
import SpaceComponent from "./SpaceComponent";
import { calcFileSize } from "../utils/calcFileSize";
import { Slider } from "@miblanchard/react-native-slider";
import RowComponent from "./RowComponent";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "../../firebaseConfig";

interface Props {
  onUpload: (file: Attachment) => void;
}

const UploadFileComponent = (props: Props) => {
  const { onUpload } = props;

  const [file, setfile] = useState<DocumentPicker.DocumentPickerAsset>();
  const [isVisibelModalUpload, setIsVisibelModalUpload] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const [attachmentFile, setAttachmentFile] = useState<Attachment>();

  useEffect(() => {
    file && handleUploadFileToStorage(file);
  }, [file]);

  useEffect(() => {
    if (attachmentFile) {
      onUpload(attachmentFile);
      setIsVisibelModalUpload(false);
      setProgressUpload(0);
      setAttachmentFile(undefined);
    }
  }, [attachmentFile]);

  const handleUploadFileToStorage = async (
    item: DocumentPicker.DocumentPickerAsset
  ) => {
    if (file) {
      setIsVisibelModalUpload(true);

      try {
        const { uri } = await FileSystem.getInfoAsync(item.uri);
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.onerror = (e) => {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        const filename = `documents/${item.name}` ?? `documents/${Date.now()}`;
        const ref = firebase.storage().ref().child(filename);

        const uploadTask = ref.put(blob as Blob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;                      
            setProgressUpload(progress);                                                                                                
          },
          (error) => {
            console.log("Upload failed", error.message);
          },
          async () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              const data: Attachment = {
                name: item.name ?? "",
                url: downloadURL,
                size: item.size ?? 0,
              };

              setAttachmentFile(data);
            });
          }
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png",
        ],
        copyToCacheDirectory: false,
      });
      if (result.canceled === false) {
        const document = result.assets[0];
        setfile(document);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => handlePickDocument()}>
        <DocumentUpload size={30} color={colors.white} />
      </TouchableOpacity>
      <Modal
        visible={isVisibelModalUpload}
        statusBarTranslucent
        animationType="slide"
        style={{ flex: 1 }}
        transparent
      >
        <View
          style={[
            globalStyles.container,
            {
              backgroundColor: `${colors.gray}80`,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              height: "auto",
              padding: 12,
              backgroundColor: colors.white,
              borderRadius: 12,
            }}
          >
            <TitleComponent text="Uploading" color={colors.bgColor} flex={0} />
            <SpaceComponent height={12} />
            <View>
              <TextComponent
                color={colors.bgColor}
                text={file?.name ?? ""}
                flex={0}
              />
              <TextComponent
                color={colors.gray2}
                text={`${calcFileSize(file?.size as number)}`}
                size={12}
                flex={0}
              />
            </View>
            <RowComponent>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Slider
                  disabled
                  value={progressUpload}
                  renderThumbComponent={() => null}
                  trackStyle={{
                    height: 6,
                    borderRadius: 100,
                  }}
                  minimumTrackTintColor={colors.success}
                  maximumTrackTintColor={colors.desc}
                />
              </View>
              <TextComponent
                text={`${Math.floor(progressUpload * 100)}%`}
                color={colors.bgColor}
                flex={0}
              />
            </RowComponent>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UploadFileComponent;
