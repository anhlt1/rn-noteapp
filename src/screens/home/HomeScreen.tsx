import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Container from "../../components/container";
import { globalStyles } from "../../styles/globalStyles";
import RowComponent from "../../components/RowComponent";
import SectionComponent from "../../components/SectionComponent";
import TextComponent from "../../components/TextComponent";
import CardComponent from "../../components/CardComponent";
import TitleComponent from "../../components/TitleComponent";
import CicularComponent from "../../components/CircularComponent";
import {
  Add,
  Edit2,
  Element4,
  Notification,
  SearchNormal,
  Logout,
} from "iconsax-react-native";
import { colors } from "../../constants/colors";
import TabComponent from "../../components/TabComponent";
import SpaceComponent from "../../components/SpaceComponent";
import CardImageComponent from "../../components/CardImageComponent";
import AvatarGroup from "../../components/AvatarGroup";
import ProgressBarComponent from "../../components/ProgressBarComponent";
import { auth, db } from "../../../firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { TaskModel, Attachment } from "../../models/TaskModel";
import { HandleDateTime } from "../../utils/HandleDateTime";
import { monthNames } from "../../constants/appInfos";
import { add0ToNumber } from "../../utils/add0ToNumber";
import PagerView from "react-native-pager-view";
import UploadFileComponent from "../../components/UploadFileComponent";
import ButtonComponent from "../../components/ButtonComponent";

const date = new Date();

const HomeScreen = ({ navigation }: any) => {
  const user = auth.currentUser;

  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<TaskModel[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    if (user) {
      getTasks();
    }
  }, [user]);

  useEffect(() => {
    if (tasks?.length > 0) {
      const items = tasks.filter((item) => item.isUrgent);
      setUrgentTasks(items);
    }
  }, [tasks]);

  const getTasks = () => {
    setIsLoading(true);
    const q = query(
      collection(db, "tasks"),
      where("uids", "array-contains", user?.uid)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.log(user?.email);
          console.log(`tasks data not found`);
          setIsLoading(false);
        } else {
          const items: TaskModel[] = [];
          snapshot.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });
          setTasks(items.sort((a, b) => b.createdAt - a.createdAt));
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching tasks: ", error);
        setIsLoading(false);
      }
    );
    // Clean up subscription on unmount
    return () => unsubscribe();
  };

  const handleMoveToTaskDetail = (id?: string, color?: string) =>
    navigation.navigate("TaskDetail", {
      id,
      color,
    });

  const handleUploadAvatar = () => {
    const userDetail = doc(db, "users", user?.uid);
    let data = {};

    onSnapshot(userDetail, (snapshot) => {
      if (snapshot.exists()) {
        data = {
          ...snapshot.data(),
          imgUrl: attachments[0].url,
        };
        setAttachments([]);
        console.log("Document data:", data);
        updateDoc(userDetail, data)
          .then(() => {
            Alert.alert("Avatar updated successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      } else {
        console.log("No such document!");
      }
    });
  };

  return (
    <PagerView style={{ flex: 1 }} initialPage={0}>
      <View style={{ flex: 1 }} key="1">
        <Container isScroll>
          <SectionComponent>
            <RowComponent justify="space-between">
              <Element4 size={30} color={colors.desc} />
              <Notification size={30} color={colors.desc} />
              {/* <Ionicons name="notifications" size={30} color={colors.desc} /> */}
            </RowComponent>
          </SectionComponent>
          <SectionComponent>
            <RowComponent>
              <View style={{ flex: 1 }}>
                <TextComponent text={`Hi, ${user?.email}`}></TextComponent>
                <TextComponent
                  text="Be productive today!"
                  size={20}
                ></TextComponent>
              </View>
              <TouchableOpacity onPress={async () => auth.signOut()}>
                <Logout size={30} color={colors.desc} />
              </TouchableOpacity>
            </RowComponent>
          </SectionComponent>
          <SectionComponent>
            <RowComponent
              styles={[globalStyles.inputContainer]}
              onPress={() =>
                navigation.navigate("ListTasks", {
                  tasks,
                })
              }
            >
              <TextComponent
                text="Search task"
                styles={{ flex: 1 }}
                color={colors.gray2}
              />
              <SearchNormal size={20} color={colors.desc} />
            </RowComponent>
          </SectionComponent>
          <SectionComponent>
            <CardComponent>
              <RowComponent>
                <View style={{ flex: 1 }}>
                  <TitleComponent text="Task progress" />
                  <TextComponent
                    text={`${tasks.filter((e) => e?.progress === 1).length}/${
                      tasks.length
                    }`}
                  ></TextComponent>
                  <SpaceComponent height={12} />
                  <RowComponent justify="flex-start">
                    <TabComponent
                      text={`${monthNames[date.getMonth()]} ${add0ToNumber(
                        date.getDate()
                      )}`}
                      onPress={() => console.log(":HI")}
                    ></TabComponent>
                  </RowComponent>
                </View>
                <View>
                  <CicularComponent
                    value={Math.floor(
                      (tasks.filter((e) => e?.progress === 1).length /
                        tasks.length) *
                        100
                    )}
                  />
                </View>
              </RowComponent>
            </CardComponent>
          </SectionComponent>
          {isLoading ? (
            <ActivityIndicator />
          ) : tasks.length > 0 ? (
            <SectionComponent>
              <RowComponent>
                <View style={{ flex: 1 }}>
                  {tasks[0] && (
                    <CardImageComponent
                      onPress={() =>
                        handleMoveToTaskDetail(
                          tasks[0].id as string,
                          "rgba(33, 150, 243, 0.9)"
                        )
                      }
                    >
                      <TouchableOpacity style={globalStyles.iconContainer}>
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TitleComponent text={tasks[0].title} />
                      <TextComponent text={tasks[0].description} size={13} />
                      <View style={{ marginVertical: 42 }}>
                        {tasks[0].uids && <AvatarGroup uids={tasks[0].uids} />}
                        {(tasks[0].progress as number) >= 0 ? (
                          <ProgressBarComponent
                            percent={`${Math.floor(tasks[0].progress * 100)}%`}
                            color="#0AACFF"
                            size="large"
                          />
                        ) : null}
                      </View>
                      {tasks[0].dueDate && (
                        <TextComponent
                          text={`Due ${HandleDateTime.DateString(
                            tasks[0].dueDate.toDate()
                          )}`}
                          size={12}
                          color={colors.desc}
                          line={2}
                        ></TextComponent>
                      )}
                    </CardImageComponent>
                  )}
                </View>
                <SpaceComponent width={16} />
                <View style={{ flex: 1 }}>
                  {tasks[1] && (
                    <CardImageComponent
                      color="rgba(33, 150, 243, 0.9)"
                      onPress={() =>
                        handleMoveToTaskDetail(
                          tasks[1].id as string,
                          "rgba(33, 150, 243, 0.9)"
                        )
                      }
                    >
                      <TouchableOpacity
                        onPress={() => {}}
                        style={globalStyles.iconContainer}
                      >
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TitleComponent text={tasks[1].title} />
                      {tasks[1].uids && <AvatarGroup uids={tasks[1].uids} />}
                      {(tasks[1].progress as number) >= 0 ? (
                        <ProgressBarComponent
                          percent={`${Math.floor(tasks[1].progress * 100)}%`}
                          color="#0AACFF"
                          size="large"
                        />
                      ) : null}
                    </CardImageComponent>
                  )}
                  <SpaceComponent height={16} />
                  {tasks[2] && (
                    <CardImageComponent
                      color="rgba(18, 181, 122, 0.9)"
                      onPress={() =>
                        handleMoveToTaskDetail(
                          tasks[2].id as string,
                          "rgba(18, 181, 122, 0.9)"
                        )
                      }
                    >
                      <TouchableOpacity style={globalStyles.iconContainer}>
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TitleComponent text={tasks[2].title} />
                      <TextComponent text={tasks[2].description} size={13} />
                    </CardImageComponent>
                  )}
                </View>
              </RowComponent>
              <RowComponent
                onPress={() =>
                  navigation.navigate("ListTasks", {
                    tasks,
                  })
                }
                styles={{ marginTop: 16 }}
              >
                <TextComponent text="See all" size={18} />
              </RowComponent>
            </SectionComponent>
          ) : (
            <></>
          )}
          <SectionComponent>
            <TextComponent
              flex={1}
              font={"bold"}
              size={21}
              text="Urgents tasks"
            />
            {urgentTasks &&
              urgentTasks?.length > 0 &&
              urgentTasks.map((item, index) => (
                <CardComponent
                  key={index}
                  styles={{ marginTop: 16, backgroundColor: colors.gray }}
                  onPress={() => handleMoveToTaskDetail(item.id as string)}
                >
                  <RowComponent>
                    <CicularComponent
                      value={Math.floor(item.progress * 100)}
                      radius={40}
                    />
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        paddingLeft: 12,
                      }}
                    >
                      <TitleComponent text={item.title} />
                      <TextComponent text={item.description} />
                    </View>
                  </RowComponent>
                </CardComponent>
              ))}
          </SectionComponent>
          <SpaceComponent height={120} width={120} />
        </Container>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate("AddNewTask", {
                editable: false,
                task: undefined,
              })
            }
            style={[
              globalStyles.row,
              {
                backgroundColor: colors.blue,
                padding: 10,
                borderRadius: 12,
                paddingVertical: 14,
                width: "80%",
              },
            ]}
          >
            <TextComponent text="Add new tasks" flex={0} />
            <Add size={30} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }} key="2">
        <Container>
          <SectionComponent
            styles={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <RowComponent styles={{ marginBottom: 16 }}>
              <TitleComponent text="Upload avatar" size={26} flex={0} />
            </RowComponent>
            <RowComponent styles={{ marginBottom: 16 }}>
              <UploadFileComponent
                onUpload={(file) =>
                  file && setAttachments([...attachments, file])
                }
              />
            </RowComponent>
            {attachments.length > 0 && (
              <RowComponent>
                <TextComponent
                  text={attachments[0].name ?? ""}
                  styles={{
                    paddingVertical: 12,
                  }}
                />
              </RowComponent>
            )}
            <ButtonComponent text="Save" onPress={() => handleUploadAvatar()} />
          </SectionComponent>
        </Container>
      </View>
    </PagerView>
  );
};

export default HomeScreen;
