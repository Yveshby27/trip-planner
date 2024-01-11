import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { firebaseAuth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);
  const [loginErrorWarning, setLoginErrorWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const emailError = "Invalid Email. Please enter a valid email address";
  const passwordError = "Wrong password. Please try again.";

  const auth = firebaseAuth;

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setInvalidInput(true);
      setLoading(false);

      if (error.code === "auth/invalid-email") {
        setLoginErrorWarning(emailError);
      } else {
        setLoginErrorWarning(passwordError);
      }

      console.log("An error occurred:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Planner</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      {invalidInput && <Text style={styles.invalid}>{loginErrorWarning}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.text}>
        Don't have an account? Press below to register
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  invalid: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    marginTop: 10,
  },
});

export default LoginScreen;
