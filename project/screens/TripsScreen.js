import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import CurrentTripItem from "./CurrentTripItem";
import {
  db,
  collection,
  getDocs,
  doc,
  updateDoc,
  firebaseAuth,
} from "../firebase";

const TripsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [tripsFromDb, setTripsFromDb] = useState([]);
  const [iscurrentArrEmpty, setIsCurrentArrEmpty] = useState(true);
  const currentUser = firebaseAuth.currentUser;

  const checkIfAccomplished = async (return_date, id) => {
    const returnDate = new Date(return_date);
    const todayDate = new Date();
    if (todayDate > returnDate) {
      try {
        const docRef = doc(db, "trips", id);
        await updateDoc(docRef, { status: "Accomplished" });
      } catch (error) {
        console.log("An error occurred:", error);
      }
    }
  };

  const fetchData = async () => {
    try {
      const query = await getDocs(collection(db, "trips"));
      const tripsData = [];
      query.forEach((doc) => {
        const {
          user_id,
          departure_date,
          departure_loc,
          destination_loc,
          return_date,
          status,
        } = doc.data();
        checkIfAccomplished(return_date, doc.id);
        if (status === "Pending" && user_id === currentUser.uid) {
          tripsData.push({
            from: departure_loc,
            to: destination_loc,
            startDate: departure_date,
            endDate: return_date,
            status,
            id: doc.id,
          });
        } else return;
      });
      setTripsFromDb(tripsData);
      if (tripsFromDb.length > 0) setIsCurrentArrEmpty(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  });

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#007AFF"
        style={styles.loadingIndicator}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CURRENT TRIPS</Text>
      {iscurrentArrEmpty && (
        <Text style={styles.noTripsText}>No Trips yet</Text>
      )}
      <FlatList
        data={tripsFromDb}
        renderItem={({ item }) => <CurrentTripItem trip={item} />}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTripsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});

export default TripsScreen;
