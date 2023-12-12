import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type AddActivityProps = {
  setActivityModalVisible: (val: boolean) => void;
};

const AddActivity = ({ setActivityModalVisible }: AddActivityProps) => {
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(0);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const handleSaveAndExit = () => {
    setActivityModalVisible(false);
  };

  const handleSaveAndAddAnother = () => {
    setActivityModalVisible(false);
  };

  const parsedDuration = Math.floor(duration);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setActivityModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Enter your activity</Text>
      <Text style={styles.label}>Activity</Text>
      <TextInput
        style={{ ...styles.input, height: "30%" }}
        onChangeText={setActivity}
        value={activity}
        placeholder='Describe your activity'
        multiline={true}
      />
      <Text style={styles.label}>Duration</Text>
      <Text>{parsedDuration} minutes</Text>
      <Slider
        style={{ height: 40 }}
        minimumValue={0}
        maximumValue={120}
        onValueChange={(val) => setDuration(val)}
      />
      <Text style={styles.label}>Time</Text>
      <DateTimePicker
        value={date}
        is24Hour={true}
        onChange={onChange}
        mode={"time"}
        locale='en_GB'
        style={{
          marginLeft: "-3%",
          marginBottom: "5%",
          alignSelf: "flex-start",
        }}
      />
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

export default AddActivity;
