import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, TouchableOpacity, Text, StyleSheet } from "react-native";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import Booking from "./screens/Booking";
import RoomList from "./screens/RoomList";

const Stack = createNativeStackNavigator();

export default function App() {
  const headerOptions = ({ navigation }) => ({
    headerStyle: styles.header,
    headerTintColor: "#FFFFFF",
    headerTitleAlign: "center",
    headerTitleStyle: styles.headerTitle,
    headerRight: () => (
      <TouchableOpacity style={styles.logoutButton} onPress={() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    ),
  });

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#732A00" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Group screenOptions={headerOptions}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="Booking" component={Booking} />
              <Stack.Screen name="RoomList" component={RoomList} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF", 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "bold",
  },
});

