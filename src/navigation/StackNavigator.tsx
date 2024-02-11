import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { TabNavigator } from "./TabNavigator";
import { ProfilePage } from "../screens/ProfilePage";
import Auth from "../screens/auth/Auth";

export type NavigatorProps = {
  modalState: {
    isAddFoodModalVisible: boolean;
    setAddFoodModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isActivityModalVisible: boolean;
    setActivityModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isSleepModalVisible: boolean;
    setSleepModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };
  handlePresentModalPress: () => void;
};

export const StackNavigator = ({
  modalState,
  handlePresentModalPress,
}: NavigatorProps) => {
  const Stack = createStackNavigator();

  return (
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
  );
};
