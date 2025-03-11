import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import { convertTemperature } from './redux/actions';

const TemperatureConverter = () => {
  const dispatch = useDispatch();
  const fahrenheit = useSelector((state) => state.fahrenheit);
  const error = useSelector((state) => state.error);
  const [input, setInput] = useState('');

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Celsius to Fahrenheit</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Celsius"
          keyboardType="numeric"
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#999"
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Convert"
            onPress={() => dispatch(convertTemperature(input))}
            color="#4CAF50"
          />
        </View>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
        {fahrenheit ? (
          <Text style={styles.result}>
            {fahrenheit} °F
          </Text>
        ) : null}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  result: {
    marginTop: 20,
    fontSize: 24,
    textAlign: 'center',
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  error: {
    marginTop: 20,
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <TemperatureConverter />
    </Provider>
  );
}
