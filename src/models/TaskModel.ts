import { firebase } from "../../firebaseConfig";

export interface TaskModel {
  id?: string;
  title: string;
  description: string;
  dueDate?: firebase.firestore.Timestamp;
  start?: firebase.firestore.Timestamp;
  end?: firebase.firestore.Timestamp;
  uids: string[];
  color?: string;
  attachments: Attachment[];
  progress?: number;
  createdAt: number;
  isUrgent: boolean;
  updatedAt: number;
}

export interface Attachment {
  name: string;
  url: string;
  size: number;
  type?: string;
}

export interface SubTask {
  createdAt: number;
  description: string;
  id: string;
  isCompleted: boolean;
  taskId: string;
  title: string;
  updatedAt: number;
}
