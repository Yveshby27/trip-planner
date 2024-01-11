import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "./HomeScreen";
import Trips from "./Trips";
const Drawer = createDrawerNavigator();

const Home = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Trips" component={Trips} />
    </Drawer.Navigator>
  );
};

export default Home;
