import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { roomData } from "../rooms.js";
import { Dropdown } from "react-native-element-dropdown";

const Dashboard = ({ navigation }) => {
  const [studentID, setStudentID] = useState("");
  const [name, setName] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleBooking = () => {
    if (!studentID || !name || !numPeople || !selectedRoom || parseInt(numPeople) <= 0) {
      Alert.alert("All Fields are Required");
      return;
    }
    navigation.navigate("Booking", { studentID, name, numPeople, selectedRoom });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Booking</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Student ID:</Text>
        <TextInput 
          value={studentID} 
          onChangeText={setStudentID} 
          style={styles.input} 
          placeholder="Student ID: "
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput 
          value={name} 
          onChangeText={setName} 
          style={styles.input} 
          placeholder="Name: "
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of People:</Text>
        <TextInput 
          value={numPeople} 
          onChangeText={setNumPeople} 
          keyboardType="numeric" 
          style={styles.input} 
          placeholder="Number of people: "
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Room:</Text>
        <Dropdown
          data={roomData.map((room) => ({
            label: room.roomNumber,
            value: room.roomNumber,
          }))}
          labelField="label"
          valueField="value"
          value={selectedRoom}
          onChange={(item) => setSelectedRoom(item.value)}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          itemTextStyle={styles.dropdownItemText}
          itemContainerStyle={styles.dropdownItemContainer}
          selectedTextStyle={styles.selectedText}
          activeColor='#FF9D23'
          placeholderStyle={styles.placeholderText}
          placeholder="Select a room"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Check Availability</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => navigation.navigate("RoomList")}
      >
        <Text style={styles.secondaryButtonText}>View My Bookings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", 
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937", 
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    fontSize: 16,
    color: "#111827",
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#374151",
  },
  dropdownItemContainer: {
    padding: 10,
  },
  selectedText: {
    fontSize: 16,
    color: "#1F2937",
  },
  placeholderText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2563EB", 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default Dashboard;
