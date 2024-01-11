import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "react-native-modal-datetime-picker";
import { db, collection, addDoc, firebaseAuth } from "../firebase";
import * as Calendar from "expo-calendar";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

const SearchTripsScreen = ({ navigation }) => {
  const [departureLoc, setDepartureLoc] = useState("");
  const [destinationLoc, setDestinationLoc] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date('2023-12-18'));
  // const [returnDate, setReturnDate] = useState(new Date());//original
  const [trackedLocation, setTrackedLocation] = useState(null);

  const [invalidLocationInput, setInvalidLocationInput] = useState(false);
  const [invalidDateInput, setInvalidDateInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  const currentUser = firebaseAuth.currentUser;

  const [isDepDateTimePickerVisible, setDepDateTimePickerVisibility] =
    useState(false);
  const [isRetDateTimePickerVisible, setRetDateTimePickerVisible] =
    useState(false);

  const cityList = [
    "Beirut",
    "Beijing",
    "Paris",
    "Budapest",
    "Berlin",
    "London",
    "Buenos Aires",
    "Vienna",
    "Madrid",
    "Amsterdam",
    "Cairo",
    "Prague",
    "Rome",
    "Tokyo",
    "Brussels",
    "New York",
    "Moscow",
    "Ottawa",
    "Lisbon",
    "Baghdad",
    "Sarajevo",
    "Bogota",
    "Zagreb",
    "Havana",
    "Copenhagen",
    "Athens",
    "Reykjajik",
    "Tehran",
    "Monte Carlo",
    "Wellington",
    "Oslo",
    "Doha",
    "Stockholm",
    "Ankara",
    "Damascus",
    "Bucharest",
    "Warsaw",
    "Muscat",
    "Rabat",
    "Nairobi",
    "Amman",
    "Dublin",
    "Glasgow",
    "New Delhi",
    "Helsinki",
    "Quito",
    "Kabul",
    "Abu Dhabi",
    "Kampala",
    "Bangkok",
    "Riyadh",
    "Dakar",
  ];
  cityList.sort();

  useEffect(() => {
    async () => {
      await setDefaultLocation();
    };
  }, []);

  const handleConfirm = async () => {
    try {
      if (departureLoc === destinationLoc) {
        setInvalidLocationInput(true);
        return;
      } else setInvalidLocationInput(false);
      // if (departureDate >= returnDate) {
      //   setInvalidDateInput(true);
      //   return;
      // } else setInvalidDateInput(false);

      setIsLoading(true);

      const addedDoc = await addDoc(collection(db, "trips"), {
        user_id: currentUser.uid,
        departure_loc: departureLoc,
        destination_loc: destinationLoc,
        departure_date: departureDate.toDateString(),
        return_date: returnDate.toDateString(),
        status: "Pending",
      });
      if ((await getCalendarPermission()) == "granted")
        await addEventToCalendar();
      await scheduleNotification();
      console.log("added document with id:", addedDoc.id);
    } catch (error) {
      console.error("an error occurred:", error);
    } finally {
      setIsLoading(false);
    }
    navigation.navigate("Current Trips");
  };

  const getCalendarPermission = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      return status;
    } catch (error) {
      console.log("an error occurred", error);
    }
  };

  const addEventToCalendar = async () => {
    try {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      if (defaultCalendar?.id && typeof defaultCalendar.id === "string") {
        const eventDetails = {
          title: `${destinationLoc} trip`,
          startDate: departureDate,
          endDate: returnDate,
          calendarId: defaultCalendar.id,
        };

        await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
        console.log("Event added successfully!");
      } else {
        console.log("Invalid or missing default calendar ID");
      }
    } catch (error) {
      console.log("An error occurred", error);
    }
  };

  const scheduleNotification = async () => {
    const notificationDate = new Date(departureDate);
    notificationDate.setDate(notificationDate.getDate() - 1);
    const todayDate = new Date();

    const timeDifference =
      (notificationDate.getTime() - todayDate.getTime()) / 1000;

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Trip Reminder",
          body: `Your trip to ${destinationLoc} starts tomorrow!`,
        },
        trigger: {
          seconds: timeDifference,
        },
      });
      console.log("Notification scheduled:", identifier);
    } catch (error) {
      console.log("an error occurred", error);
    }
  };

  const getLocationPermission = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      console.log(status);
      return status;
    } catch (error) {
      console.log("an error occurred", error);
    }
  };

  const setDefaultLocation = async () => {
    try {
      if ((await getLocationPermission()) === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        setTrackedLocation(location);
        console.log("Location", trackedLocation);
        setDepartureLoc(city);
        console.log("City:", city);
      } else console.log("not granted");
    } catch (error) {
      console.log("An error occurred", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Trip</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Departure Location</Text>
        <SelectDropdown
          data={cityList}
          onSelect={(selectItem) => setDepartureLoc(selectItem)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Arrival Location</Text>
        <SelectDropdown
          data={cityList}
          onSelect={(selectItem) => setDestinationLoc(selectItem)}
        />
      </View>
      {invalidLocationInput && (
        <Text style={styles.invalid}>Invalid Location Input.</Text>
      )}

      <View style={styles.dateContainer}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Departure Date</Text>
          <TouchableOpacity
            onPress={() => setDepDateTimePickerVisibility(true)}
          >
            <Text style={styles.dateText}>{departureDate.toDateString()}</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={isDepDateTimePickerVisible}
            date={departureDate}
            onChange={(date) => setDepartureDate(date)}
            onConfirm={() => setDepDateTimePickerVisibility(false)}
            onCancel={() => setDepDateTimePickerVisibility(false)}
          />
        </View>

        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Return Date</Text>
          <TouchableOpacity onPress={() => setRetDateTimePickerVisible(true)}>
            <Text style={styles.dateText}>{returnDate.toDateString()}</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={isRetDateTimePickerVisible}
            date={returnDate}
            onChange={(date) => setReturnDate(date)}
            onConfirm={() => setRetDateTimePickerVisible(false)}
            onCancel={() => setRetDateTimePickerVisible(false)}
          />
        </View>
      </View>
      {invalidDateInput && (
        <Text style={styles.invalid}>Invalid Date Input.</Text>
      )}

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Confirm Trip</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "black",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datePickerContainer: {
    flex: 1,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    color: "blue",
  },
  confirmButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  invalid: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15,
  },
});

export default SearchTripsScreen;
