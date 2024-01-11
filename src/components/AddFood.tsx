import React, { useState } from "react";
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

type AddFoodProps = {
  setAddFoodModalVisible: (val: boolean) => void;
};

const AddFood = ({ setAddFoodModalVisible }: AddFoodProps) => {
  const [meal, setMeal] = useState("");
  const [timestamp, setTimestamp] = useState(new Date());

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setTimestamp(currentDate);
  };

  const handleSaveAndExit = async () => {
    const { data, error } = await supabase
      .from("meals")
      .insert([{ time: timestamp, description: meal }]);
    if (error) {
      console.log("Error saving meal: ", error);
    } else {
      setAddFoodModalVisible(false);
    }
  };

  const handleSaveAndAddAnother = async () => {
    const { data, error } = await supabase
      .from("meals")
      .insert([{ time: timestamp, description: meal }]);
    if (error) {
      console.log("Error saving meal: ", error);
    } else {
      setMeal("");
      setTimestamp(new Date());
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setAddFoodModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Enter your meal</Text>
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
        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveAndAddAnother}
          disabled={!meal}
        >
          <Text>Save & Add Another</Text>
        </TouchableOpacity>
      </View>
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
