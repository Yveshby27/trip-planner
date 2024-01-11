import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const PastTripItem = ({ trip }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: "From", value: trip.from },
          { key: "To", value: trip.to },
          { key: "Departure Date", value: trip.startDate },
          { key: "Return Date", value: trip.endDate },
          { key: "Status", value: trip.status },
        ]}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.keyText}>{item.key}</Text>
            <Text style={styles.valueText}>{item.value}</Text>
          </View>
        )}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    margin: 5,
    borderRadius: 8,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  keyText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  valueText: {
    fontSize: 16,
  },
});

export default PastTripItem;
