import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { supabase } from "../api/supabaseClient";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";

type AddFoodProps = {
  setAddFoodModalVisible: (val: boolean) => void;
  currentMeal: any; // add a type here
  setCurrentMeal: (val: any) => void; // add a type here
};

const AddFood = ({
  setAddFoodModalVisible,
  currentMeal,
  setCurrentMeal,
}: AddFoodProps) => {
  const [meal, setMeal] = useState("");
  const [timestamp, setTimestamp] = useState(new Date());
  const { refreshMeals } = useContext(UserDataContext);

  const { userSession } = useContext(AuthContext);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setTimestamp(currentDate);
  };

  const handleSaveAndExit = async () => {
    if (!userSession) return;
    let result; // add a type here

    if (currentMeal) {
      result = await supabase
        .from("meals")
        .update({
          time: timestamp,
          description: meal,
        })
        .match({ id: currentMeal.id });
    } else {
      result = await supabase
        .from("meals")
        .insert([{ time: timestamp, description: meal, uid: userSession.id }]);
    }
    const { data, error } = result;
    if (error) {
      console.log("Error saving meal: ", error);
    } else {
      setAddFoodModalVisible(false);
      setCurrentMeal(null);
      refreshMeals(userSession);
    }
  };

  const handleSaveAndAddAnother = async () => {
    const { data, error } = await supabase
      .from("meals")
      .insert([{ time: timestamp, description: meal, uid: userSession.id }]);
    if (error) {
      console.log("Error saving meal: ", error);
    } else {
      setMeal("");
      setTimestamp(new Date());
      refreshMeals(userSession);
    }
  };

  useEffect(() => {
    if (currentMeal) {
      setMeal(currentMeal.description);
      setTimestamp(new Date(currentMeal.time));
    }
  }, [currentMeal]);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setAddFoodModalVisible(false);
          setCurrentMeal(null);
        }}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {currentMeal ? "Edit your meal" : "Enter your meal"}
      </Text>

      <Text style={styles.label}>Meal</Text>
      <TextInput
        style={{ ...styles.input, height: "30%" }}
        onChangeText={setMeal}
        value={meal}
        placeholder='Describe your meal'
        multiline={true}
      />
      <Text style={styles.label}>Time</Text>
      <DateTimePicker
        value={timestamp}
        onChange={onChange}
        mode={"datetime"}
        locale='en_GB'
        style={{
          marginLeft: "-3%",
          marginBottom: "5%",
          alignSelf: "flex-start",
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveAndExit}
          disabled={!meal}
        >
          <Text>Save & Exit</Text>
        </TouchableOpacity>

        {!currentMeal && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSaveAndAddAnother}
            disabled={!meal}
          >
            <Text>Save & Add Another</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOffset: { height: 0, width: 0 },
    elevation: 5,
    width: "90%",
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
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    marginBottom: 10,
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

export default AddFood;
