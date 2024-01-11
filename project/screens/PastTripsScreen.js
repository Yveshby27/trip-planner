import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { db, collection, getDocs, firebaseAuth } from "../firebase";
import PastTripItem from "./PastTripItem";

const PastTripsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [tripsFromDb, setTripsFromDb] = useState([]);
  const [isPastArrEmpty, setIsPastArrEmpty] = useState(true);
  const currentUser = firebaseAuth.currentUser;

  const fetchData = useCallback(async () => {
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
        if (status !== "Pending" && user_id === currentUser?.uid) {
          tripsData.push({
            from: departure_loc,
            to: destination_loc,
            startDate: departure_date,
            endDate: return_date,
            status,
            id: doc.id,
          });
        } else {
          return;
        }
      });

      setTripsFromDb(tripsData);
      setIsPastArrEmpty(tripsData.length === 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <>
          <Text style={styles.title}>PAST TRIPS</Text>
          {isPastArrEmpty && (
            <Text style={styles.noTripsText}>No Past Trips</Text>
          )}
          <FlatList
            data={tripsFromDb}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PastTripItem trip={item} />}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
  },
  noTripsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default PastTripsScreen;
