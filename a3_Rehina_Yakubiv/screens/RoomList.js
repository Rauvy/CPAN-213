import React from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { connect } from "react-redux";
import { deleteBooking } from "../redux/actions/bookingActions";

const RoomList = ({ navigation, bookedRooms, deleteBooking }) => {
  const handleDeleteRoom = (roomNumber) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to cancel booking for room ${roomNumber}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteBooking(roomNumber);
            Alert.alert("Success", "Room booking has been cancelled successfully.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingDetails}>
        <Text style={styles.roomNumber}>{item.roomNumber}</Text>
        <Text style={styles.bookingInfo}>Student: {item.name} ({item.studentID})</Text>
        <Text style={styles.bookingInfo}>Capacity: {item.capacity}</Text>
        <Text style={styles.bookingInfo}>People: {item.numPeople}</Text>
        <Text style={styles.bookingInfo}>
          Booked on: {new Date(item.bookingDate).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteRoom(item.roomNumber)}
      >
        <Text style={styles.deleteButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Booked Rooms</Text>
      
      {bookedRooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't booked any rooms yet.</Text>
          <TouchableOpacity 
            style={styles.bookNowButton}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={styles.bookNowButtonText}>Book a Room Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookedRooms}
          keyExtractor={(item) => item.roomNumber}
          renderItem={renderBookingItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookingItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  bookingDetails: {
    flex: 1,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  bookingInfo: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 3,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  bookNowButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookNowButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
    backgroundColor: "#4B5563",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

const mapStateToProps = (state) => ({
  bookedRooms: state.booking.bookedRooms
});

const mapDispatchToProps = {
  deleteBooking
};

export default connect(mapStateToProps, mapDispatchToProps)(RoomList); 