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

type AddSleepProps = {
  setSleepModalVisible: (val: boolean) => void;
};

const AddSleep = ({ setSleepModalVisible }: AddSleepProps) => {
  const [date, setDate] = useState(new Date());
  const [durationInMin, setDurationInMin] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const handleSaveAndExit = () => {
    setSleepModalVisible(false);
  };

  const handleSaveAndAddAnother = () => {
    setSleepModalVisible(false);
  };

  const hours = Math.floor(durationInMin / 60);
  const minutes = Math.floor(durationInMin % 60);
  const parsedDuration = `${hours}h ${minutes}m`;

  const parseSleepQuality = (sleepQuality: number) => {
    let parsedSleepQuality = "";
    if (sleepQuality <= 1) {
      parsedSleepQuality = "Very Poor";
    } else if (sleepQuality <= 2) {
      parsedSleepQuality = "Poor";
    } else if (sleepQuality <= 3) {
      parsedSleepQuality = "Fair";
    } else if (sleepQuality <= 4) {
      parsedSleepQuality = "Good";
    } else if (sleepQuality <= 5) {
      parsedSleepQuality = "Excellent";
    }
    return parsedSleepQuality;
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setSleepModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Sleep</Text>

      <Text style={styles.label}>Bedtime</Text>
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
      <Text style={styles.label}>Duration</Text>
      <Text>{parsedDuration} hours</Text>
      <Slider
        style={{ height: 40 }}
        minimumValue={0}
        maximumValue={600}
        onValueChange={(val) => setDurationInMin(val)}
      />
      <Text style={styles.label}>Sleep Quality</Text>
      <Text>{parseSleepQuality(sleepQuality)}</Text>
      <Slider
        style={{ height: 40 }}
        minimumValue={0}
        maximumValue={5}
        onValueChange={(val) => setSleepQuality(val)}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveAndExit}>
          <Text>Save & Exit</Text>
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

export default AddSleep;
