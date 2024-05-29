import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";
import { UserDetail } from "../models/UserDetail";
import { db } from "../../firebaseConfig";

interface Props {
  uid: string;
  index?: number;
}

const AvatarComponent = (props: Props) => {
  const { uid, index } = props;

  const [userDetail, setUserDetail] = useState<UserDetail>();

  useEffect(() => {
    getDoc(doc(db, `users`, uid))
      .then((snap: any) => {
        snap.exists &&
          setUserDetail({
            uid,
            ...snap.data(),
          });
      })
      .catch((error) => console.log(error));
  }, [uid]);
  const imageStyle = {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  };
  return userDetail ? (
    userDetail.imgUrl ? (
      <Image
        source={{ uri: userDetail.imgUrl }}
        key={`image${uid}`}
        style={[imageStyle, { marginLeft: index && index > 0 ? -10 : 0 }]}
      />
    ) : (
      <View
        key={`image${uid}`}
        style={[
          imageStyle,
          {
            marginLeft: index && index > 0 ? -10 : 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.gray2,
          },
        ]}
      >
        <Text style={[globalStyles.text, { fontWeight: "bold", fontSize: 14 }]}>
          {userDetail && userDetail.displayName
            ? userDetail.displayName[0].toUpperCase()
            : "A"}
        </Text>
      </View>
    )
  ) : (
    <></>
  );
};

export default AvatarComponent;
