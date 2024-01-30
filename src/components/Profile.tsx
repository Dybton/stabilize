import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { supabase } from "../api/supabaseClient";

import { useNavigation } from "@react-navigation/native";

type ProfileProps = {
  setProfileModalVisible: (val: boolean) => void;
};

const Profile: React.FC<ProfileProps> = ({ setProfileModalVisible }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out: ", error);
    } else {
      setProfileModalVisible(false);
      navigation.navigate("Auth");
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Text style={styles.title}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOffset: { height: 0, width: 0 },
    elevation: 5,
    width: "50%",
    justifyContent: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
  },
});

export default Profile;
