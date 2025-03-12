import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { connect } from "react-redux";
import { addBooking } from "../redux/actions/bookingActions";
import { roomData } from "../rooms.js";

const Booking = ({ route, navigation, addBooking }) => {
  const { studentID, name, numPeople, selectedRoom } = route.params;
  const room = roomData.find((room) => room.roomNumber === selectedRoom);
  const isAvailable = room?.available && parseInt(numPeople) <= room.capacity;
  
  const handleBookRoom = () => {
    if (!isAvailable) {
      Alert.alert(
        "Booking Failed", 
        `Room ${selectedRoom} is ${!room.available ? "not available" : "not big enough for " + numPeople + " people"}.`
      );
      return;
    }
    
    const bookingData = {
      studentID,
      name,
      roomNumber: selectedRoom,
      capacity: room.capacity,
      numPeople: parseInt(numPeople),
      bookingDate: new Date().toISOString(),
    };
    
    addBooking(bookingData);
    
    Alert.alert(
      "Booking Successful", 
      `Room ${selectedRoom} has been booked successfully!`,
      [
        { 
          text: "View My Bookings", 
          onPress: () => navigation.navigate("RoomList") 
        },
        { 
          text: "OK", 
          onPress: () => navigation.navigate("Dashboard") 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Student ID: <Text style={styles.boldText}>{studentID}</Text></Text>
        <Text style={styles.detailText}>Name: <Text style={styles.boldText}>{name}</Text></Text>
        <Text style={styles.detailText}>Room: <Text style={styles.boldText}>{selectedRoom}</Text></Text>
        <Text style={styles.detailText}>Number of People: <Text style={styles.boldText}>{numPeople}</Text></Text>
        <Text style={[styles.detailText, isAvailable ? styles.available : styles.notAvailable]}>
          Status: {isAvailable ? 
            "Room is available and sufficient for your group" : 
            `Room is ${!room.available ? "not available" : "not big enough for your group"}`
          }
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {isAvailable && (
          <TouchableOpacity style={styles.bookButton} onPress={handleBookRoom}>
            <Text style={styles.buttonText}>Book Room</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate("RoomList")}
        >
          <Text style={styles.buttonText}>View My Bookings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", 
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937", 
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF", 
    padding: 20,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    color: "#374151", 
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#111827", 
  },
  available: {
    color: "#10B981", 
    fontWeight: "bold",
  },
  notAvailable: {
    color: "#EF4444", 
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    marginTop: 10,
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    paddingHorizontal: 30,
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
});

const mapDispatchToProps = {
  addBooking
};

export default connect(null, mapDispatchToProps)(Booking);
