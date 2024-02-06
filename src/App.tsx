import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Testo } from "./components/Testo";
import { GlucoseLevelChart } from "./screens/GlucoseLevelChart";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GraphIcon } from "./components/Icons/GraphIcon";
import { AddIcon } from "./components/Icons/AddIcon";
import { BookIcon } from "./components/Icons/BookIcon";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modal } from "react-native";
import AddFood from "./components/AddFood";
import AddActivity from "./components/AddActivity";
import AddSleep from "./components/AddSleep";
import Auth from "./screens/auth/Auth";
import * as Linking from "expo-linking";
import Log from "./screens/Log";
import { ProfilePage } from "./screens/ProfilePage";

const prefix = Linking.createURL("/"); // creates a prefix, ie what comes before the path

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ handlePresentModalPress, modalState }) => {
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

export default function App() {
  const linking = {
    prefixes: [prefix],

    config: {
      screens: {
        Auth: "auth",
      },
    },
  };

  const [isAddFoodModalVisible, setAddFoodModalVisible] = useState(false);
  const [isActivityModalVisible, setActivityModalVisible] = useState(false);
  const [isSleepModalVisible, setSleepModalVisible] = useState(false);
  const bottomSheetModalRef = useRef(null);

  const modalState = {
    isAddFoodModalVisible,
    setAddFoodModalVisible,
    isActivityModalVisible,
    setActivityModalVisible,
    isSleepModalVisible,
    setSleepModalVisible,
  };

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index) => {}, []); // add type here

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer
          linking={linking}
          fallback={<Text>Loading...</Text>}
        >
          <Stack.Navigator
            initialRouteName='Graph'
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name='Home'>
              {(props) => (
                <TabNavigator
                  modalState={modalState}
                  {...props}
                  handlePresentModalPress={handlePresentModalPress}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name='Auth' component={Auth} />
            <Stack.Screen name='Profile' component={ProfilePage} />
          </Stack.Navigator>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enableContentPanningGesture={true}
          >
            <View style={styles2.contentContainer}>
              <View style={styles2.roundButtonContainer}>
                <TouchableOpacity
                  style={styles2.roundButton}
                  onPress={() => {
                    bottomSheetModalRef.current?.dismiss();
                    setSleepModalVisible(true);
                  }}
                ></TouchableOpacity>
                <Text style={{ marginTop: 10 }}>Sleep</Text>
              </View>

              <View style={styles2.roundButtonContainer}>
                <TouchableOpacity
                  style={styles2.roundButton}
                  onPress={() => {
                    bottomSheetModalRef.current?.dismiss();
                    setAddFoodModalVisible(true);
                  }}
                ></TouchableOpacity>
                <Text style={{ marginTop: 10 }}>Diet</Text>
              </View>

              <View style={styles2.roundButtonContainer}>
                <TouchableOpacity
                  style={styles2.roundButton}
                  onPress={() => {
                    bottomSheetModalRef.current?.dismiss();
                    setActivityModalVisible(true);
                  }}
                ></TouchableOpacity>
                <Text style={{ marginTop: 10 }}>Activity</Text>
              </View>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={styles2.closeButton}
                onPress={() => bottomSheetModalRef.current?.dismiss()}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetModal>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles2 = StyleSheet.create({
  // ... other styles
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  roundButtonContainer: {
    justifyContent: "center",
    alignItems: "center", // This will center the text vertically
    margin: 10,
  },
  roundButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
    backgroundColor: "skyblue",
  },
  closeButton: {
    marginBottom: 10,
    alignSelf: "center",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "skyblue",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
