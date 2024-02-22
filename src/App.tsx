import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import { AuthProvider } from "./contexts/AuthContext";
import { StackNavigator } from "./navigation/StackNavigator";
import { UserDataProvider } from "./contexts/UserDataContext";

const prefix = Linking.createURL("/");

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
    <AuthProvider>
      <UserDataProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <NavigationContainer
              linking={linking}
              fallback={<Text>Loading...</Text>}
            >
              <StackNavigator
                handlePresentModalPress={handlePresentModalPress}
                modalState={modalState}
              />
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
      </UserDataProvider>
    </AuthProvider>
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
