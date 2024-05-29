import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import HomeScreen from "../screens/home/HomeScreen";
import AddNewTask from "../screens/tasks/AddNewTask";
import SearchScreen from "../screens/SearchScreen";
import TaskDetail from "../screens/tasks/TaskDetail";
import ListTasks from "../screens/tasks/ListTasks";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, []);
  const Stack = createNativeStackNavigator();

  const MainRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTask" component={AddNewTask} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetail} />
      <Stack.Screen name="ListTasks" component={ListTasks} />
    </Stack.Navigator>
  );

  const AuthRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );

  return isLogin ? MainRouter : AuthRouter;
};

export default Router;
