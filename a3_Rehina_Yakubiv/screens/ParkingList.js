import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ParkingList = ({ navigation }) => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('parkings')
      .orderBy('parkingDateTime', 'desc')
      .onSnapshot(
        snapshot => {
          const parkingList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setParkings(parkingList);
          setLoading(false);
        },
        error => {
          console.error('Error fetching parkings:', error);
          Alert.alert('Error', 'Failed to load parkings');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const renderParkingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.parkingItem}
      onPress={() => navigation.navigate('ParkingDetail', { parking: item })}
    >
      <Text style={styles.dateText}>
        {new Date(item.parkingDateTime.toDate()).toLocaleString()}
      </Text>
      <Text style={styles.buildingCode}>Building: {item.buildingCode}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading parkings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking List</Text>
      
      {parkings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No parkings found</Text>
        </View>
      ) : (
        <FlatList
          data={parkings}
          renderItem={renderParkingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddParking')}
      >
        <Text style={styles.addButtonText}>Add New Parking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  parkingItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  buildingCode: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ParkingList; 