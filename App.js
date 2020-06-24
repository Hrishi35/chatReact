import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InChatScreen from './screens/InChatScreen';
import ChatScreen from './screens/ChatScreen';
import ForwardTo from './screens/ForwardTo';

const Stack = createStackNavigator();

function App(){
	return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Chat">
        <Stack.Screen options={{headerShown: false}} name="Chat" component={ChatScreen} />
        <Stack.Screen options={{headerShown: false}} name="InChat" component={InChatScreen} />
        <Stack.Screen options={{headerShown: false}} name="Forward" component={ForwardTo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;