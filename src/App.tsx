import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
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
import Log from "./screens/Log";

import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const supabaseUrl = "https://otnwcihcxevjhlzrkgwk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bndjaWhjeGV2amhsenJrZ3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxMDQzMjAsImV4cCI6MjAxODY4MDMyMH0.dtldAtubHDX0cyp1uab5em-YT2O9E2Zq7CPxhwDw87c";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
  // auth: {
  //   storage: AsyncStorage,
  //   autoRefreshToken: true,
  //   persistSession: true,
  //   detectSessionInUrl: false,
  // },
);

async function getCountries() {
  const { data } = await supabase.from("countries").select();
  console.debug(data);
  // setCountries(data);
}

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
        name='Graph'
        component={GlucoseLevelChart}
        options={{
          tabBarIcon: ({ focused }) => (
            <GraphIcon color={focused ? "blue" : "grey"} />
          ),
          tabBarShowLabel: false,
        }}
      />
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
        name='Notes'
        component={Log}
        options={{
          tabBarIcon: ({ focused }) => (
            <BookIcon color={focused ? "blue" : "grey"} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  useEffect(() => {
    console.debug("useEffect");
    getCountries();
  }, []);

  const [isAddFoodModalVisible, setAddFoodModalVisible] = useState(false);
  const [isActivityModalVisible, setActivityModalVisible] = useState(false);
  const [isSleepModalVisible, setSleepModalVisible] = useState(false);
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index) => {}, []); // add type here

  if (isAddFoodModalVisible) {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={isAddFoodModalVisible}
        onRequestClose={() => {
          setAddFoodModalVisible(!isAddFoodModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <AddFood setAddFoodModalVisible={setAddFoodModalVisible} />
        </View>
      </Modal>
    );
  }
  if (isActivityModalVisible) {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={isActivityModalVisible}
        onRequestClose={() => {
          setActivityModalVisible(!isActivityModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <AddActivity setActivityModalVisible={setActivityModalVisible} />
        </View>
      </Modal>
    );
  }

  if (isSleepModalVisible) {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={isSleepModalVisible}
        onRequestClose={() => {
          setSleepModalVisible(!isSleepModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <AddSleep setSleepModalVisible={setSleepModalVisible} />
        </View>
      </Modal>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home'>
              {(props) => (
                <TabNavigator
                  {...props}
                  handlePresentModalPress={handlePresentModalPress}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <View style={styles2.contentContainer}>
              <View style={styles2.roundButtonContainer}>
                <TouchableOpacity
                  style={styles2.roundButton}
                  onPress={() => setSleepModalVisible(true)}
                ></TouchableOpacity>
                <Text style={{ marginTop: 10 }}>Sleep</Text>
              </View>

              <View style={styles2.roundButtonContainer}>
                <TouchableOpacity
                  style={styles2.roundButton}
                  onPress={() => setAddFoodModalVisible(true)}
                ></TouchableOpacity>
                <Text style={{ marginTop: 10 }}>Diet</Text>
              </View>

              <View style={styles2.roundButtonContainer}>
                <TouchableOpacity
                  style={styles2.roundButton}
                  onPress={() => setActivityModalVisible(true)}
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
