import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BooksStore from "./screens/BooksStore";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Books" component={BooksStore} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
