import { View, Text, TouchableOpacity } from "react-native";
import { AccountIcon } from "../components/Icons/AccountIcon";
import { supabase } from "../api/supabaseClient";

export const ProfilePage = () => {
  return (
    <>
      <View style={{ flex: 1, alignItems: "flex-start", marginTop: "5%" }}>
        <Text> Back </Text>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <AccountIcon height='30' width='30' />
        <Text style={{ fontSize: 24 }}>Profile</Text>
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <Text> Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
