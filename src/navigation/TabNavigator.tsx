import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GlucoseLevelChart } from "../screens/GlucoseLevelChart";
import { GraphIcon } from "../components/Icons/GraphIcon";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { AddIcon } from "../components/Icons/AddIcon";
import { BookIcon } from "../components/Icons/BookIcon";
import Log from "../screens/Log";
import { NavigatorProps } from "./StackNavigator";

const Tab = createBottomTabNavigator();

export const TabNavigator = ({
  handlePresentModalPress,
  modalState,
}: NavigatorProps) => {
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
        name='Graph'
        options={{
          tabBarIcon: ({ focused }) => (
            <GraphIcon color={focused ? "blue" : "grey"} />
          ),
          tabBarShowLabel: false,
        }}
      >
        {(props) => <GlucoseLevelChart {...props} modalState={modalState} />}
      </Tab.Screen>
      <Tab.Screen
        name='Add'
        component={GlucoseLevelChart}
        options={{
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity onPress={handlePresentModalPress}>
              <View style={{ marginBottom: 14 }}>
                <AddIcon color={focused ? "blue" : "grey"} />
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
        name='Log'
        options={{
          tabBarIcon: ({ focused }) => (
            <BookIcon color={focused ? "blue" : "grey"} />
          ),
          tabBarShowLabel: false,
        }}
      >
        {(props) => <Log {...props} modalState={modalState} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
