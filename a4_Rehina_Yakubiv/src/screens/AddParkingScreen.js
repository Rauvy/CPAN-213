import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme, IconButton, Divider } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

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

const AddParkingScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (values) => {
    try {
      await addDoc(collection(db, 'parkings'), {
        ...values,
        dateTime: date,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding parking:', error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Formik
          initialValues={{
            buildingCode: '',
            hours: '',
            licensePlate: '',
            streetAddress: '',
            latitude: '',
            longitude: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.sectionHeader}>
                <IconButton icon="car" size={24} iconColor="#888" />
                <Text style={styles.sectionTitle}>Parking Information</Text>
              </View>
              <Divider style={styles.divider} />
              
              <TextInput
                label="Building Code"
                value={values.buildingCode}
                onChangeText={handleChange('buildingCode')}
                onBlur={handleBlur('buildingCode')}
                error={touched.buildingCode && errors.buildingCode}
                style={styles.input}
                mode="outlined"
                theme={{ 
                  colors: { 
                    text: '#fff', 
                    placeholder: '#888',
                    primary: '#4CAF50',
                    error: '#ff4444',
                    background: '#2A2A2A',
                    surface: '#2A2A2A',
                  } 
                }}
                outlineColor="#333"
                activeOutlineColor="#4CAF50"
              />
              {touched.buildingCode && errors.buildingCode && (
                <Text style={styles.errorText}>{errors.buildingCode}</Text>
              )}

              <TextInput
                label="Hours (1, 4, 12, or 24)"
                value={values.hours}
                onChangeText={handleChange('hours')}
                onBlur={handleBlur('hours')}
                error={touched.hours && errors.hours}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                theme={{ 
                  colors: { 
                    text: '#fff', 
                    placeholder: '#888',
                    primary: '#4CAF50',
                    error: '#ff4444',
                    background: '#2A2A2A',
                    surface: '#2A2A2A',
                  } 
                }}
                outlineColor="#333"
                activeOutlineColor="#4CAF50"
              />
              {touched.hours && errors.hours && (
                <Text style={styles.errorText}>{errors.hours}</Text>
              )}

              <TextInput
                label="License Plate"
                value={values.licensePlate}
                onChangeText={handleChange('licensePlate')}
                onBlur={handleBlur('licensePlate')}
                error={touched.licensePlate && errors.licensePlate}
                style={styles.input}
                mode="outlined"
                theme={{ 
                  colors: { 
                    text: '#fff', 
                    placeholder: '#888',
                    primary: '#4CAF50',
                    error: '#ff4444',
                    background: '#2A2A2A',
                    surface: '#2A2A2A',
                  } 
                }}
                outlineColor="#333"
                activeOutlineColor="#4CAF50"
              />
              {touched.licensePlate && errors.licensePlate && (
                <Text style={styles.errorText}>{errors.licensePlate}</Text>
              )}

              <View style={styles.sectionHeader}>
                <IconButton icon="map-marker" size={24} iconColor="#888" />
                <Text style={styles.sectionTitle}>Location Information</Text>
              </View>
              <Divider style={styles.divider} />

              <TextInput
                label="Street Address"
                value={values.streetAddress}
                onChangeText={handleChange('streetAddress')}
                onBlur={handleBlur('streetAddress')}
                error={touched.streetAddress && errors.streetAddress}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={2}
                theme={{ 
                  colors: { 
                    text: '#fff', 
                    placeholder: '#888',
                    primary: '#4CAF50',
                    error: '#ff4444',
                    background: '#2A2A2A',
                    surface: '#2A2A2A',
                  } 
                }}
                outlineColor="#333"
                activeOutlineColor="#4CAF50"
              />
              {touched.streetAddress && errors.streetAddress && (
                <Text style={styles.errorText}>{errors.streetAddress}</Text>
              )}

              <TextInput
                label="Latitude"
                value={values.latitude}
                onChangeText={handleChange('latitude')}
                onBlur={handleBlur('latitude')}
                error={touched.latitude && errors.latitude}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                theme={{ 
                  colors: { 
                    text: '#fff', 
                    placeholder: '#888',
                    primary: '#4CAF50',
                    error: '#ff4444',
                    background: '#2A2A2A',
                    surface: '#2A2A2A',
                  } 
                }}
                outlineColor="#333"
                activeOutlineColor="#4CAF50"
              />
              {touched.latitude && errors.latitude && (
                <Text style={styles.errorText}>{errors.latitude}</Text>
              )}

              <TextInput
                label="Longitude"
                value={values.longitude}
                onChangeText={handleChange('longitude')}
                onBlur={handleBlur('longitude')}
                error={touched.longitude && errors.longitude}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                theme={{ 
                  colors: { 
                    text: '#fff', 
                    placeholder: '#888',
                    primary: '#4CAF50',
                    error: '#ff4444',
                    background: '#2A2A2A',
                    surface: '#2A2A2A',
                  } 
                }}
                outlineColor="#333"
                activeOutlineColor="#4CAF50"
              />
              {touched.longitude && errors.longitude && (
                <Text style={styles.errorText}>{errors.longitude}</Text>
              )}

              <View style={styles.sectionHeader}>
                <IconButton icon="clock-outline" size={24} iconColor="#888" />
                <Text style={styles.sectionTitle}>Date and Time</Text>
              </View>
              <Divider style={styles.divider} />

              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
                icon="calendar"
                textColor="#fff"
                iconColor="#888"
                buttonColor="#2A2A2A"
                borderColor="#333"
              >
                Select Date and Time
              </Button>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                />
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                icon="check"
                buttonColor="#4CAF50"
                labelStyle={styles.buttonLabel}
              >
                Add Parking
              </Button>
            </View>
          )}
        </Formik>
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
  input: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 4,
  },
  dateButton: {
    marginVertical: 16,
    borderColor: '#333',
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddParkingScreen; 