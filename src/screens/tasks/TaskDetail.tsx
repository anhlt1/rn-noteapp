import { auth, db } from "../../../firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { Slider } from "@miblanchard/react-native-slider";
import {
  AddSquare,
  ArrowLeft2,
  CalendarEdit,
  Clock,
  TickCircle,
  TickSquare,
} from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarGroup from "../../components/AvatarGroup";
import RowComponent from "../../components/RowComponent";
import SectionComponent from "../../components/SectionComponent";
import SpaceComponent from "../../components/SpaceComponent";
import TextComponent from "../../components/TextComponent";
import TitleComponent from "../../components/TitleComponent";
import { Attachment, SubTask, TaskModel } from "../../models/TaskModel";
import { colors } from "../../constants/colors";
import { HandleDateTime } from "../../utils/HandleDateTime";
import CardComponent from "../../components/CardComponent";
import ButtonComponent from "../../components/ButtonComponent";
import UploadFileComponent from "../../components/UploadFileComponent";
import { calcFileSize } from "../../utils/calcFileSize";
import ModalAddSubTask from "../../modals/ModalAddSubTask";

const TaskDetail = ({ navigation, route }: any) => {
  const { id, color }: { id: string; color?: string } = route.params;
  const [taskDetail, setTaskDetail] = useState<TaskModel>();
  const [progress, setProgress] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isVisibleModalSubTask, setIsVisibleModalSubTask] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    getTaskDetail();
    getSubTaskById();
  }, [id]);

  // theo dõi sự thay đổi của taskDetail
  useEffect(() => {
    if (taskDetail) {
      setProgress(taskDetail.progress ?? 0);
      setAttachments(taskDetail.attachments);
      setIsUrgent(taskDetail.isUrgent);
    }
  }, [taskDetail]);

  // theo dõi sự thay đổi của progress và attachments
  useEffect(() => {
    progress !== taskDetail?.progress ||
    attachments?.length !== taskDetail.attachments?.length
      ? setIsChanged(true)
      : setIsChanged(false);
  }, [progress, taskDetail, attachments]);

  // theo dõi sự thay đổi của subTasks
  useEffect(() => {
    if (subTasks?.length > 0) {
      const completedPercent =
        subTasks.filter((element) => element.isCompleted)?.length /
        subTasks?.length;

      setProgress(completedPercent);
    }
  }, [subTasks]);

  const getTaskDetail = () => {
    const docRef = doc(collection(db, "tasks"), id);
    onSnapshot(
      docRef,
      (doc: any) => {
        if (doc.exists) {
          setTaskDetail({
            id,
            ...doc.data(),
          });
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.error("Error fetching tasks: ", error);
      }
    );
  };

  const handleUpdateTask = async () => {
    const data = {
      ...taskDetail,
      progress,
      attachments,
      updatedAt: Date.now(),
    };
    await updateDoc(doc(db, "tasks", id), data)
      .then(() => {
        Alert.alert("Update task successfully!");
      })
      .catch((error) => console.log(error));
  };

  const handleRemoveTask = () => {
    if (!taskDetail) return;
    Alert.alert("Are you sure?", "Do you want to remove this task?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Deleted!",
        style: "destructive",
        onPress: async () => {
          // Remove task
          await deleteDoc(doc(db, "tasks", id))
            .then(() => {
              navigation.goBack();
            })
            .catch((error) => console.log(error.message));
        },
      },
    ]);
  };

  const handleUpdateSubTask = async (id: string, isCompleted: boolean) => {
    try {
      await updateDoc(doc(db, "subTasks", id), {
        isCompleted: !isCompleted,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSubTaskById = () => {
    const q = query(collection(db, "subTasks"), where("taskId", "==", id));
    onSnapshot(q, (querySnapshot) => {
      const items: SubTask[] = [];
      querySnapshot.forEach((item: any) => {
        items.push({
          id: item.id,
          ...item.data(),
        });
      });
      setSubTasks(items);
    });
  };

  const handleUpdateUrgentState = async () => {
    try {
      const data = {
        ...taskDetail,
        updatedAt: Date.now(),
      };
      await updateDoc(doc(db, "tasks", id), {
        ...data,
        isUrgent: !isUrgent,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return taskDetail ? (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: colors.bgColor }}>
        <StatusBar />
        <SectionComponent
          color={color ?? "rgba(113, 77, 217, 0.9)"}
          styles={{
            paddingTop: 60,
            paddingBottom: 18,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <RowComponent styles={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft2
                size={28}
                color={colors.white}
                style={{ marginTop: -8, marginRight: 12 }}
              />
            </TouchableOpacity>
            <TitleComponent
              line={1}
              flex={1}
              text={taskDetail.title}
              size={22}
            />
          </RowComponent>
          <View style={{ marginTop: 20 }}>
            <TextComponent text="Due date" />
            <RowComponent styles={{ justifyContent: "space-between" }}>
              <RowComponent
                styles={{
                  flex: 1,
                  justifyContent: "flex-start",
                }}
              >
                <Clock size={20} color={colors.white} />
                <SpaceComponent width={4} />
                {taskDetail.end && taskDetail.start && (
                  <TextComponent
                    flex={0}
                    text={`${HandleDateTime.GetHour(
                      taskDetail.start?.toDate()
                    )} - ${HandleDateTime.GetHour(taskDetail.end?.toDate())}`}
                  />
                )}
              </RowComponent>
              {taskDetail.dueDate && (
                <RowComponent
                  styles={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SpaceComponent width={20} />
                  <CalendarEdit size={20} color={colors.white} />
                  <SpaceComponent width={4} />
                  <TextComponent
                    flex={0}
                    text={
                      HandleDateTime.DateString(taskDetail.dueDate.toDate()) ??
                      ""
                    }
                  />
                </RowComponent>
              )}
              <View
                style={{
                  flex: 1,

                  alignItems: "flex-end",
                }}
              >
                <AvatarGroup uids={taskDetail.uids} />
              </View>
            </RowComponent>
          </View>
        </SectionComponent>
        <SectionComponent>
          <TitleComponent text="Description" size={22}></TitleComponent>
          <CardComponent
            bgColor={colors.gray}
            styles={{
              borderWidth: 3,
              borderColor: colors.gray,
              borderRadius: 20,
              marginTop: 12,
            }}
          >
            <TextComponent
              flex={1}
              text={taskDetail.description}
              line={20}
            ></TextComponent>
          </CardComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent onPress={handleUpdateUrgentState}>
            <TickSquare
              variant={isUrgent ? "Bold" : "Outline"}
              size={24}
              color={colors.white}
            />
            <SpaceComponent width={8} />
            <TextComponent flex={1} text={`Is Urgent`} size={18} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <TitleComponent text="Files & Links" flex={1} />
            <UploadFileComponent
              onUpload={(file) =>
                file && setAttachments([...attachments, file])
              }
            />
          </RowComponent>
          {attachments?.length > 0 &&
            attachments.map((item, index) => (
              <View
                key={index}
                style={{ justifyContent: "flex-start", marginBottom: 8 }}
              >
                <TextComponent text={item.name} font="bold" />
                <TextComponent text={calcFileSize(item.size)} size={12} />
              </View>
            ))}
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: colors.success,
                marginRight: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 100,
                  borderWidth: 2,
                  backgroundColor: colors.success,
                }}
              ></View>
            </View>
            <TitleComponent text="Progress" flex={1} size={18} />
          </RowComponent>
          <SpaceComponent height={12} />
          <RowComponent>
            <View
              style={{
                flex: 1,
              }}
            >
              <Slider
                onValueChange={(value: number[]) => setProgress(value[0])}
                value={progress}
                thumbTintColor={colors.success}
                minimumTrackTintColor={colors.success}
                maximumTrackTintColor={colors.gray2}
                trackStyle={{ height: 10, borderRadius: 100 }}
                thumbStyle={{ borderWidth: 2, borderColor: colors.white }}
              ></Slider>
            </View>
            <SpaceComponent width={20} />
            <TitleComponent text={`${Math.floor(progress * 100)}%`} size={18} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <TitleComponent flex={1} text="Sub tasks" size={20} />
            <TouchableOpacity onPress={() => setIsVisibleModalSubTask(true)}>
              <AddSquare size={25} color={colors.success} />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={12} />
          {subTasks &&
            subTasks?.length > 0 &&
            subTasks.map((item, index) => (
              <CardComponent
                key={`${index}`}
                styles={{ marginBottom: 12, backgroundColor: colors.gray }}
              >
                <RowComponent
                  onPress={() => handleUpdateSubTask(item.id, item.isCompleted)}
                >
                  <TickCircle
                    variant={item.isCompleted ? "Bold" : "Outline"}
                    color={colors.success}
                    size={22}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <TextComponent text={item.title} />
                    <TextComponent
                      size={12}
                      color={"#e0e0e0"}
                      text={HandleDateTime.DateString(new Date(item.createdAt))}
                    />
                  </View>
                </RowComponent>
              </CardComponent>
            ))}
        </SectionComponent>
        <SpaceComponent height={70} width={70} />
        <SectionComponent>
          <RowComponent onPress={handleRemoveTask}>
            <TextComponent text="Delete task" color="red" flex={0} />
          </RowComponent>
        </SectionComponent>
      </ScrollView>
      {isChanged && (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            left: 20,
            zIndex: 100,
          }}
        >
          <ButtonComponent text="Update" onPress={() => handleUpdateTask()} />
        </View>
      )}
      <ModalAddSubTask
        visible={isVisibleModalSubTask}
        onClose={() => setIsVisibleModalSubTask(false)}
        taskId={id}
      />
    </>
  ) : (
    <></>
  );
};

export default TaskDetail;
