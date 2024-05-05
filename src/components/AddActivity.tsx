import React, { useContext, useEffect, useState } from "react";
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

import { supabase } from "../api/supabaseClient";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";

type AddActivityProps = {
  setActivityModalVisible: (val: boolean) => void;
  currentActivity: any; // add a type here
  setCurrentActivity: (val: any) => void; // add a type here
};

const AddActivity = ({
  setActivityModalVisible,
  currentActivity,
  setCurrentActivity,
}: AddActivityProps) => {
  const [activity, setActivity] = useState("");
  const [timestamp, setTimestamp] = useState(new Date());
  const [duration, setDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const { userSession } = useContext(AuthContext);

  const { refreshActivities } = useContext(UserDataContext);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setTimestamp(currentDate);
  };

  const handleSaveAndExit = async () => {
    let result;
    if (currentActivity) {
      result = await supabase
        .from("activities")
        .update({
          time: timestamp,
          description: activity,
          duration,
        })
        .match({ id: currentActivity.id });
    } else {
      result = await supabase.from("activities").insert([
        {
          time: timestamp,
          description: activity,
          duration,
          uid: userSession.id,
        },
      ]);
    }

    const { data, error } = result;
    if (error) {
      console.log("Error saving activity: ", error);
    } else {
      setActivityModalVisible(false);
      setCurrentActivity(null);
      refreshActivities(userSession);
    }
  };

  const handleSaveAndAddAnother = async () => {
    const { error } = await supabase.from("activities").insert([
      {
        time: timestamp,
        description: activity,
        duration,
        uid: userSession.id,
      },
    ]);
    if (error) {
      console.log("Error saving meal: ", error);
    } else {
      setActivity("");
      setTimestamp(new Date());
      setDuration(0);
      setSliderValue(0);
      refreshActivities(userSession);
    }
  };

  useEffect(() => {
    if (currentActivity) {
      setActivity(currentActivity.description);
      setDuration(currentActivity.duration);
      setSliderValue(currentActivity.duration);
      setTimestamp(new Date(currentActivity.time));
    }
  }, [currentActivity]);

  const parsedDuration = Math.floor(duration);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setActivityModalVisible(false);
          setCurrentActivity(null);
        }}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {currentActivity ? "Edit your activity" : "Enter your activity"}
      </Text>
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
        onValueChange={(val) => {
          setDuration(val);
          setSliderValue(val);
        }}
        value={sliderValue}
      />
      <Text style={styles.label}>Start time</Text>
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
          disabled={!activity}
        >
          <Text>Save & Exit</Text>
        </TouchableOpacity>
        {!currentActivity && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSaveAndAddAnother}
            disabled={!activity}
          >
            <Text>Save & Add Another</Text>
            {/* make sure they have the same formatting */}
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

export default AddActivity;
