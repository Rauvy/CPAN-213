import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddParking = ({ navigation }) => {
  const [buildingCode, setBuildingCode] = useState('');
  const [hours, setHours] = useState('1');
  const [licensePlate, setLicensePlate] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const validateForm = () => {
    // Building code validation (5 alphanumeric characters)
    if (!/^[A-Za-z0-9]{5}$/.test(buildingCode)) {
      Alert.alert('Error', 'Building code must be exactly 5 alphanumeric characters');
      return false;
    }

    // Hours validation
    const validHours = ['1', '4', '12', '24'];
    if (!validHours.includes(hours)) {
      Alert.alert('Error', 'Please select a valid parking duration');
      return false;
    }

    // License plate validation (2-8 alphanumeric characters)
    if (!/^[A-Za-z0-9]{2,8}$/.test(licensePlate)) {
      Alert.alert('Error', 'License plate must be 2-8 alphanumeric characters');
      return false;
    }

    // Street address validation
    if (!streetAddress.trim()) {
      Alert.alert('Error', 'Please enter a street address');
      return false;
    }

    // Latitude and longitude validation
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Error', 'Please enter valid latitude and longitude coordinates');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await firestore().collection('parkings').add({
        buildingCode,
        hours: parseInt(hours),
        licensePlate,
        streetAddress,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        parkingDateTime: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Parking added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error adding parking:', error);
      Alert.alert('Error', 'Failed to add parking');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Parking</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Building Code (5 alphanumeric characters)</Text>
        <TextInput
          style={styles.input}
          value={buildingCode}
          onChangeText={setBuildingCode}
          placeholder="Enter building code"
          maxLength={5}
        />

        <Text style={styles.label}>Parking Duration</Text>
        <View style={styles.hoursContainer}>
          {['1', '4', '12', '24'].map((hour) => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.hourButton,
                hours === hour && styles.hourButtonSelected,
              ]}
              onPress={() => setHours(hour)}
            >
              <Text style={[
                styles.hourButtonText,
                hours === hour && styles.hourButtonTextSelected,
              ]}>
                {hour} {parseInt(hour) === 1 ? 'hour' : 'hours'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>License Plate (2-8 alphanumeric characters)</Text>
        <TextInput
          style={styles.input}
          value={licensePlate}
          onChangeText={setLicensePlate}
          placeholder="Enter license plate"
          maxLength={8}
        />

        <Text style={styles.label}>Street Address</Text>
        <TextInput
          style={styles.input}
          value={streetAddress}
          onChangeText={setStreetAddress}
          placeholder="Enter street address"
        />

        <Text style={styles.label}>Location</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            value={latitude}
            onChangeText={setLatitude}
            placeholder="Latitude"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.locationInput]}
            value={longitude}
            onChangeText={setLongitude}
            placeholder="Longitude"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Parking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  hourButton: {
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  hourButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  hourButtonText: {
    color: '#333',
  },
  hourButtonTextSelected: {
    color: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddParking; 