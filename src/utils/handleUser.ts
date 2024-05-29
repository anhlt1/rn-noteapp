import { db, firebase } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export class HandleUser {
  static SaveToDatabase = async (user: firebase.UserInfo) => {
    const data = {
      email: user.email ?? "",
      displayName: user.displayName
        ? user.displayName
        : user.email
        ? user.email.split("@")[0]
        : "",
    };

    try {
      await setDoc(doc(db, "users", user.uid), data)
        .then(() => console.log("User added!!"))
        .catch((error) => console.log(error.message));
    } catch (error) {
      console.log(error);
    }
  };
}
