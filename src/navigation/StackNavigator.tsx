import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { TabNavigator } from "./TabNavigator";
import { ProfilePage } from "../screens/ProfilePage";
import Auth from "../screens/auth/Auth";
import { AuthContext } from "../contexts/AuthContext";

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
  const { userSession, loadingSession } = useContext(AuthContext);
  const Stack = createStackNavigator();

  if (loadingSession) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={!loadingSession && userSession ? "Graph" : "Auth"}
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
