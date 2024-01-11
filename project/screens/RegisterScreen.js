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
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const auth = firebaseAuth;

  const passwordIsValid = () => {
    if (password.length < 8) return false;
    for (let i = 0; i < password.length; i++) {
      if (password.charAt(i) >= "0" && password.charAt(i) <= "9") {
        return true;
      }
    }
    return false;
  };

  const emailIsValid = () => {
    if (email === "") return false;
    return true;
  };

  const checkInput = () => {
    if (!passwordIsValid() || !emailIsValid()) {
      setInvalidInput(true)
    }
    else setInvalidInput(false)
    
  };

  const handleSubmit = async () => {
    checkInput();
    if (!invalidInput) {
      try {
        setLoading(true);
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(response);
      } catch (error) {
        console.log("an error occurred", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
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
     
      {invalidInput && (
        <View>
          <Text style={styles.invalid}>
            Invalid Input. Make sure your email and password are valid. Password
            must contain at least 8 characters including 1 number
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
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
    backgroundColor: "green",
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
  },
});

export default RegisterScreen;
