import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { db, doc, updateDoc } from "../firebase";

const CurrentTripItem = ({ trip }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [tripDetails, setTripDetails] = useState({});

  const getDetails = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=a737f24aca1345c59e7192105231704&q=${trip.to}`
      );
      const data = await response.json();
      manageJSON(data);
    } catch (error) {
      console.log("error fetching data:", error);
    }
  };

  const manageJSON = (object) => {
    let managedObject = {
      country: object.location.country,
      time: object.location.localtime,
      condition: object.current.condition.text,
      temperatureInF: object.current.temp_f,
      temperatureInC: object.current.temp_c,
    };
    setTripDetails(managedObject);
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleCancel = async () => {
    try {
      const docRef = doc(db, "trips", trip.id);
      await updateDoc(docRef, { status: "Cancelled" });
      console.log("Cancelled");
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: "From", value: trip.from },
          { key: "To", value: trip.to },
          { key: "Start", value: trip.startDate },
          { key: "End", value: trip.endDate },
        ]}
        renderItem={({ item }) => (
          <View style={styles.tripInfoContainer}>
            <Text style={styles.keyText}>{item.key}</Text>
            <Text style={styles.keyValue}>{item.value}</Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
        <Text style={styles.toggleText}>
          {!showDetails ? "Show Details" : "Hide Details"}
        </Text>
      </TouchableOpacity>

      {showDetails && (
        <FlatList
          data={[
            { key: "Destination Country", value: tripDetails.country },
            { key: "Time", value: tripDetails.time },
            { key: "Condition", value: tripDetails.condition },
            {
              key: "Temperature (F)",
              value: `${tripDetails.temperatureInF}°F`,
            },
            {
              key: "Temperature (C)",
              value: `${tripDetails.temperatureInC}°C`,
            },
          ]}
          renderItem={({ item }) => (
            <View style={styles.detailsContainer}>
              <Text style={styles.keyText}>{item.key}</Text>
              <Text style={styles.keyValue}>{item.value}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  tripInfoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "700",
  },
  keyValue: {
    fontSize: 16,
  },
  toggleText: {
    color: "blue",
    fontSize: 14,
    marginVertical: 5,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CurrentTripItem;
