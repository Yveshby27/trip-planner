import Home from "./screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { firebaseAuth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import Login from "./screens/Login";

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  const auth = firebaseAuth;

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      console.log("user:", user);
      setUser(user);
    });
    signOut(auth);
    return subscriber;
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="black"></StatusBar>
        <Stack.Navigator initialRouteName="LoginSection">
          {user ? (
            <Stack.Screen
              name="HomeSection"
              component={Home}
              options={{ headerShown: false }}
            ></Stack.Screen>
          ) : (
            <Stack.Screen
              name="LoginSection"
              component={Login}
              options={{ headerShown: false }}
            ></Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
