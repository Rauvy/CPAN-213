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

const ParkingDetail = ({ route, navigation }) => {
  const { parking } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    buildingCode: parking.buildingCode,
    hours: parking.hours.toString(),
    licensePlate: parking.licensePlate,
    streetAddress: parking.streetAddress,
    latitude: parking.location.latitude.toString(),
    longitude: parking.location.longitude.toString(),
  });

  const validateForm = () => {
    // Building code validation (5 alphanumeric characters)
    if (!/^[A-Za-z0-9]{5}$/.test(formData.buildingCode)) {
      Alert.alert('Error', 'Building code must be exactly 5 alphanumeric characters');
      return false;
    }

    // Hours validation
    const validHours = ['1', '4', '12', '24'];
    if (!validHours.includes(formData.hours)) {
      Alert.alert('Error', 'Please select a valid parking duration');
      return false;
    }

    // License plate validation (2-8 alphanumeric characters)
    if (!/^[A-Za-z0-9]{2,8}$/.test(formData.licensePlate)) {
      Alert.alert('Error', 'License plate must be 2-8 alphanumeric characters');
      return false;
    }

    // Street address validation
    if (!formData.streetAddress.trim()) {
      Alert.alert('Error', 'Please enter a street address');
      return false;
    }

    // Latitude and longitude validation
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Error', 'Please enter valid latitude and longitude coordinates');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await firestore().collection('parkings').doc(parking.id).update({
        buildingCode: formData.buildingCode,
        hours: parseInt(formData.hours),
        licensePlate: formData.licensePlate,
        streetAddress: formData.streetAddress,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },
      });

      Alert.alert('Success', 'Parking updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating parking:', error);
      Alert.alert('Error', 'Failed to update parking');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this parking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('parkings').doc(parking.id).delete();
              Alert.alert('Success', 'Parking deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error('Error deleting parking:', error);
              Alert.alert('Error', 'Failed to delete parking');
            }
          },
        },
      ]
    );
  };

  const renderField = (label, key, placeholder, maxLength, keyboardType = 'default') => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={formData[key]}
          onChangeText={(text) => setFormData({ ...formData, [key]: text })}
          placeholder={placeholder}
          maxLength={maxLength}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.value}>{formData[key]}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Parking Details</Text>

      <View style={styles.form}>
        {renderField('Building Code', 'buildingCode', 'Enter building code', 5)}
        {renderField('Hours', 'hours', 'Enter hours', null)}
        {renderField('License Plate', 'licensePlate', 'Enter license plate', 8)}
        {renderField('Street Address', 'streetAddress', 'Enter street address')}
        {renderField('Latitude', 'latitude', 'Enter latitude', null, 'numeric')}
        {renderField('Longitude', 'longitude', 'Enter longitude', null, 'numeric')}

        <Text style={styles.label}>Parking Date</Text>
        <Text style={styles.value}>
          {new Date(parking.parkingDateTime.toDate()).toLocaleString()}
        </Text>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
  fieldContainer: {
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: '#DDD',
  },
  value: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#8E8E93',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ParkingDetail; 