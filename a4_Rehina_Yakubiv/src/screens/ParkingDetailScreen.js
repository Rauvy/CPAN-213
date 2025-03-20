import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform, BackHandler, TouchableOpacity } from 'react-native';
import { Text, Surface, useTheme, Button, TextInput, IconButton, Divider } from 'react-native-paper';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  buildingCode: Yup.string()
    .matches(/^[A-Za-z0-9]{5}$/, 'Building code must be exactly 5 alphanumeric characters')
    .required('Building code is required'),
  hours: Yup.string()
    .oneOf(['1', '4', '12', '24'], 'Invalid parking duration')
    .required('Parking duration is required'),
  licensePlate: Yup.string()
    .min(2, 'License plate must be at least 2 characters')
    .max(8, 'License plate must be at most 8 characters')
    .matches(/^[A-Za-z0-9]+$/, 'License plate can only contain alphanumeric characters')
    .required('License plate is required'),
  streetAddress: Yup.string().required('Street address is required'),
  latitude: Yup.number()
    .required('Latitude is required')
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  longitude: Yup.number()
    .required('Longitude is required')
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
});

const ParkingDetailScreen = ({ route, navigation }) => {
  const { parking } = route.params;
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date(parking.dateTime.toDate()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [values, setValues] = useState({
    buildingCode: parking.buildingCode,
    hours: parking.hours,
    licensePlate: parking.licensePlate,
    streetAddress: parking.streetAddress,
    latitude: parking.latitude.toString(),
    longitude: parking.longitude.toString(),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showDatePicker) {
        setShowDatePicker(false);
        return true;
      }
      if (editingField) {
        setEditingField(null);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [showDatePicker, editingField]);

  const handleUpdateTime = async (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setCurrentDate(selectedDate);
      try {
        await updateDoc(doc(db, 'parkings', parking.id), {
          dateTime: selectedDate,
        });
      } catch (error) {
        console.error('Error updating time:', error);
      }
    }
  };

  const handleUpdateField = async (field, value) => {
    try {
      const updateData = {};
      if (field === 'latitude' || field === 'longitude') {
        updateData[field] = parseFloat(value);
      } else {
        updateData[field] = value;
      }

      await updateDoc(doc(db, 'parkings', parking.id), updateData);
      setValues(prev => ({ ...prev, [field]: value }));
      setEditingField(null);
      setErrors({});
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const validateField = async (field, value) => {
    try {
      await validationSchema.validateAt(field, { [field]: value });
      setErrors(prev => ({ ...prev, [field]: undefined }));
      handleUpdateField(field, value);
    } catch (error) {
      setErrors(prev => ({ ...prev, [field]: error.message }));
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Parking',
      'Are you sure you want to delete this parking record?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'parkings', parking.id));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting parking:', error);
              Alert.alert('Error', 'Failed to delete parking record');
            }
          },
        },
      ]
    );
  };

  const renderField = (field, label, value, keyboardType = 'default', multiline = false) => {
    const isEditing = editingField === field;
    const error = errors[field];

    if (isEditing) {
      return (
        <View style={styles.editContainer}>
          <TextInput
            value={values[field]}
            onChangeText={(text) => setValues(prev => ({ ...prev, [field]: text }))}
            onBlur={() => validateField(field, values[field])}
            keyboardType={keyboardType}
            multiline={multiline}
            error={!!error}
            style={styles.input}
            mode="outlined"
            autoFocus
            theme={{ colors: { text: '#fff', placeholder: '#888' } }}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      );
    }

    return (
      <View style={styles.detailRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <IconButton
            icon="pencil"
            size={18}
            onPress={() => setEditingField(field)}
            style={styles.editIcon}
            iconColor="#888"
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <IconButton icon="car" size={24} iconColor="#888" />
            <Text style={styles.sectionTitle}>Parking Information</Text>
          </View>
          <Divider style={styles.divider} />

          {renderField('buildingCode', 'Building Code', values.buildingCode)}
          {renderField('hours', 'Hours', values.hours, 'numeric')}
          {renderField('licensePlate', 'License Plate', values.licensePlate)}

          <View style={styles.sectionHeader}>
            <IconButton icon="map-marker" size={24} iconColor="#888" />
            <Text style={styles.sectionTitle}>Location Information</Text>
          </View>
          <Divider style={styles.divider} />

          {renderField('streetAddress', 'Street Address', values.streetAddress, 'default', true)}
          {renderField('latitude', 'Latitude', values.latitude, 'numeric')}
          {renderField('longitude', 'Longitude', values.longitude, 'numeric')}

          <View style={styles.sectionHeader}>
            <IconButton icon="clock-outline" size={24} iconColor="#888" />
            <Text style={styles.sectionTitle}>Date and Time</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date/Time</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{currentDate.toLocaleString()}</Text>
              <IconButton
                icon="clock"
                size={18}
                onPress={() => setShowDatePicker(true)}
                style={styles.editIcon}
                iconColor="#888"
              />
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={currentDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleUpdateTime}
            />
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleDelete}
              style={styles.deleteButton}
              buttonColor="#ff4444"
              icon="delete"
              labelStyle={styles.buttonLabel}
            >
              Delete Parking
            </Button>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  surface: {
    margin: 16,
    padding: 16,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
  },
  form: {
    padding: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  divider: {
    backgroundColor: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  valueContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  editIcon: {
    margin: 0,
    padding: 0,
  },
  editContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#fff',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  deleteButton: {
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ParkingDetailScreen; 