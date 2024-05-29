import React, { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import Container from "../../components/container";
import DateTimePickerComponent from "../../components/DateTimePickerComponent";
import InputComponent from "../../components/InputComponent";
import RowComponent from "../../components/RowComponent";
import SectionComponent from "../../components/SectionComponent";
import SpaceComponent from "../../components/SpaceComponent";
import TitleComponent from "../../components/TitleComponent";
import TextComponent from "../../components/TextComponent";
import { Attachment, TaskModel } from "../../models/TaskModel";
import DropdownPicker from "../../components/DropdownPicker";
import { SelectModel } from "../../models/SelectModel";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import UploadFileComponent from "../../components/UploadFileComponent";

const initValue: TaskModel = {
  title: "",
  description: "",
  dueDate: undefined,
  start: undefined,
  end: undefined,
  uids: [],
  attachments: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isUrgent: false,
};

const AddNewTask = ({ navigation, route }: any) => {
  const user = auth.currentUser;

  const { editable, task }: { editable: boolean; task?: TaskModel } =
    route.params;

  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);
  const [usersSelect, setUsersSelect] = useState<SelectModel[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    setTaskDetail({ ...taskDetail, uids: [user.uid] });
    handleGetAllUsers();
  }, []);

  // useEffect(() => {
  //   user && setTaskDetail({ ...taskDetail, uids: [user.uid] });
  // }, [user]);

  const handleGetAllUsers = async () => {
    await getDocs(collection(db, "users"))
      .then((snap) => {
        if (snap.empty) {
          console.log(`users data not found`);
        } else {
          const items: SelectModel[] = [];

          snap.forEach((item) => {
            items.push({
              label: item.data().displayName,
              value: item.id,
            });
          });

          setUsersSelect(items);
        }
      })
      .catch((error: any) => {
        console.log(`Can not get users, ${error.message}`);
      });
  };

  const handleChangeValue = (id: string, value: string | string[] | Date) => {
    const item: any = { ...taskDetail };

    item[`${id}`] = value;

    setTaskDetail(item);
  };

  const handleAddNewTask = async () => {
    // setTaskDetail({ ...taskDetail, uids: [user.uid] });
    const data = {
      ...taskDetail,
      attachments,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("New Task:");
    console.log(data);

    await addDoc(collection(db, "tasks"), data)
      .then(() => {
        console.log("New task added");
        navigation.goBack();
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <Container back title="Add new task">
      <ScrollView>
        <SectionComponent>
          <InputComponent
            value={taskDetail.title}
            onChange={(val) => handleChangeValue("title", val)}
            title="Title"
            allowClear
            placeholder="Title of task"
          />
          <InputComponent
            value={taskDetail.description}
            onChange={(val) => handleChangeValue("description", val)}
            title="Description"
            allowClear
            placeholder="Content"
            multible
            numberOfLine={3}
          />

          <DateTimePickerComponent
            selected={taskDetail.dueDate || new Date()}
            onSelect={(val) => handleChangeValue("dueDate", val)}
            placeholder="Choice"
            type="date"
            title="Due date"
          />

          <RowComponent>
            <View style={{ flex: 1 }}>
              <DateTimePickerComponent
                selected={taskDetail.start}
                type="time"
                onSelect={(val) => handleChangeValue("start", val)}
                title="Start"
              />
            </View>
            <SpaceComponent width={14} />
            <View style={{ flex: 1 }}>
              <DateTimePickerComponent
                selected={taskDetail.end}
                onSelect={(val) => handleChangeValue("end", val)}
                title="End"
                type="time"
              />
            </View>
          </RowComponent>

          <DropdownPicker
            selected={taskDetail.uids}
            items={usersSelect}
            onSelect={(val) => handleChangeValue("uids", val)}
            title="Members"
            multible
          />
          <View>
            <RowComponent
              styles={{
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <TitleComponent text="Attachments" flex={0} />
              <SpaceComponent width={10} />
              <UploadFileComponent
                onUpload={(file) =>
                  file && setAttachments([...attachments, file])
                }
              />
            </RowComponent>
            {attachments.length > 0 &&
              attachments.map((item, index) => {
                return (
                  <RowComponent key={`attachment${index}`}>
                    <TextComponent
                      text={item.name ?? ""}
                      styles={{
                        paddingVertical: 12,
                      }}
                    />
                  </RowComponent>
                );
              })}
          </View>
        </SectionComponent>
        <SectionComponent>
          <Button title="Save" onPress={handleAddNewTask} />
        </SectionComponent>
      </ScrollView>
    </Container>
  );
};

export default AddNewTask;
