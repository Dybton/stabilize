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


const Stack  = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
        <View style={{marginBottom: 14}}>
          <AddIcon color={focused ? 'blue' : 'grey'} />
        </View>
      ),
      tabBarShowLabel: false,
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
  return (
    <NavigationContainer>
     <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


