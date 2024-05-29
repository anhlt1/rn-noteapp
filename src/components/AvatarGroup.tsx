import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { colors } from "../constants/colors";
import RowComponent from "./RowComponent";
import TextComponent from "./TextComponent";
import { getDoc, doc } from "firebase/firestore";
import AvatarComponent from "./AvatarComponent";
import { db } from "../../firebaseConfig";

interface Props {
  uids: string[];
}

const AvatarGroup = (props: Props) => {
  const { uids } = props;

  const [usersName, setUsersName] = useState<
    {
      name: string;
      imgUrl: string;
    }[]
  >([]);

  useEffect(() => {
    getUserAvata();
  }, [uids]);

  const getUserAvata = async () => {
    const items: any = [...usersName];
    uids &&
      uids.forEach(async (id) => {
        getDoc(doc(db, `users`, id))
          .then((snap: any) => {
            if (snap.exists) {
              items.push({
                name: snap.data().displayName,
                imgUrl: snap.data().imgUrl ?? "",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    setUsersName(items);
  };

  const imageStyle = {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  };
  return (
    <RowComponent styles={{ justifyContent: "flex-start" }}>
      {uids &&
        uids.map(
          (item, index) =>
            index < 3 && <AvatarComponent uid={item} index={index} key={item} />
        )}
      {uids && uids.length > 3 && (
        <View
          key={"total"}
          style={[
            imageStyle,
            {
              backgroundColor: "coral",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              marginLeft: -10,
            },
          ]}
        >
          <TextComponent
            flex={0}
            styles={{
              lineHeight: 19,
            }}
            font={"bold"}
            text={`+${uids.length - 3 > 9 ? 9 : uids.length - 3}`}
          />
        </View>
      )}
    </RowComponent>
  );
};

export default AvatarGroup;
