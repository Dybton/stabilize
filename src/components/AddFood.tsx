import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type AddFoodProps = {
  setAddFoodModalVisible: (val: boolean) => void;
};

const AddFood = ({ setAddFoodModalVisible }: AddFoodProps) => {
  const [meal, setMeal] = useState("");
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const handleSaveAndExit = () => {
    setAddFoodModalVisible(false);
    console.log("test");
  };

  const handleSaveAndAddAnother = () => {
    setAddFoodModalVisible(false);
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
        style={styles.input}
        onChangeText={setMeal}
        value={meal}
        placeholder='Describe your meal'
      />
      <Text style={styles.label}>Time</Text>
      <TextInput style={styles.input} onChangeText={setTime} value={time} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveAndExit}>
          <Text>Save & Exit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveAndAddAnother}
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
