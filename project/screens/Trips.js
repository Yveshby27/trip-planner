import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TripsScreen from "./TripsScreen";
import PastTripsScreen from "./PastTripsScreen";
import SearchTripsScreen from "./SearchTripsScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Trips = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Current Trips") {
            iconName = "airplane";
          } else if (route.name === "Past Trips") {
            iconName = "list";
          } else if (route.name === "Search For Trips") {
            iconName = "search";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "blue",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Current Trips" component={TripsScreen} />
      <Tab.Screen name="Past Trips" component={PastTripsScreen}></Tab.Screen>
      <Tab.Screen
        name="Search For Trips"
        component={SearchTripsScreen}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default Trips;
