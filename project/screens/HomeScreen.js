import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebaseAuth } from "../firebase";
import { signOut } from "firebase/auth";

const HomeScreen = () => {
  const auth = firebaseAuth;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error occurred:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Travel Planner</Text>
      <Text style={styles.description}>
        Explore, Plan, and Experience the world with our Travel Planner App.
        Your gateway to seamless trip planning and unforgettable adventures.
      </Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.creator}>
        Created by: Yves Habchi and Elie Maalouf
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f4f4f4",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  creator: {
    fontSize: 16,
    color: "#888888",
    marginTop: 40,
  },
});

export default HomeScreen;
