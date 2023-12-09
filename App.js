import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {Testo} from './Testo';
import { Test3 } from './Test3';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {GraphIcon} from './components/Icons/GraphIcon';
import {AddIcon} from './components/Icons/AddIcon';
import {BookIcon} from './components/Icons/BookIcon';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ handlePresentModalPress }) => {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIcon: () => null, // This line removes the icon
        headerShown: false,
        tabBarStyle: {
          height: 60, // Set your desired height here
        },
      }}
    >
  <Tab.Screen 
    name="Graph" 
    component={Test3} 
    options={{ 
      tabBarIcon: ({ focused }) => (
        <GraphIcon color={focused ? 'blue' : 'grey'} />
      ),
      tabBarShowLabel: false,
    }}
  />
  <Tab.Screen 
  name="Add" 
  component={Testo} 
  options={{ 
    tabBarIcon: ({ focused }) => (
      <TouchableOpacity onPress={handlePresentModalPress}>
        <View style={{marginBottom: 14}}>
          <AddIcon color={focused ? 'blue' : 'grey'} />
        </View>
      </TouchableOpacity>
    ),
    tabBarShowLabel: false,
  }}
  listeners={{
    tabPress: (e) => {
      // Prevent the default action (navigation)
      e.preventDefault();
      // Call your function
      handlePresentModalPress();
    },
  }}
/>
  <Tab.Screen 
    name="Notes" 
    component={Testo} 
    options={{ 
      tabBarIcon: ({ focused }) => (
        <BookIcon color={focused ? 'blue' : 'grey'} />
      ),
      tabBarShowLabel: false,
    }}
  />
</Tab.Navigator>
  )
}

export default function App() {

  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);
  
  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <BottomSheetModalProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {props => <TabNavigator {...props} handlePresentModalPress={handlePresentModalPress} />}
        </Stack.Screen>
        </Stack.Navigator>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheetModal>
      </NavigationContainer>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});