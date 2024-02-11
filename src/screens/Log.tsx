import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import FoodIconBasic from "../components/Icons/FoodIconBasic";
import ActivityIcon from "../components/Icons/ActivityIcon";
import SleepIcon from "../components/Icons/SleepIcon";
import { supabase } from "../api/supabaseClient";
import { formatTime } from "../utils/formatTime";
import { parseSleepQuality } from "../utils/parseSleepQuality";
import { formatDuration } from "../utils/formatDuration";
import { AccountIcon } from "../components/Icons/AccountIcon";
import { TouchableOpacity } from "react-native";
import Profile from "../components/Profile";
import ReUsableModal from "../components/ReUsableModal";
import { AuthContext } from "../contexts/AuthContext";

const Log = ({ modalState }) => {
  const [sleepData, setSleepData] = React.useState(null);
  const [meals, setMeals] = React.useState(null);
  const [activities, setActivities] = React.useState(null);
  const [profileModalVisible, setProfileModalVisible] = React.useState(false);

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  useEffect(() => {
    const fetchSleepData = async () => {
      const cufoffStart = new Date();
      cufoffStart.setDate(cufoffStart.getDate() - 1);
      cufoffStart.setHours(18, 0, 0, 0);

      const cutOffEnd = new Date();
      cutOffEnd.setHours(18, 0, 0, 0);

      const { data, error } = await supabase
        .from("sleep")
        .select("*")
        .gte("time", cufoffStart)
        .lte("time", cutOffEnd);

      console.log("Sleep data: ", data);
      if (error || !data) {
        console.log("Error fetching sleep data: ", error);
        return;
      } else {
        console.log("Sleep data: ", data);
        setSleepData(data);
      }
    };

    const fetchMealData = async () => {
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .gte("time", startOfDay)
        .lte("time", new Date());

      console.log("Meal data: ", data);
      if (error || !data) {
        console.log("Error fetching meal data: ", error);
        return;
      } else {
        setMeals(data);
      }
    };

    const fetchActivityData = async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .gte("time", startOfDay)
        .lte("time", new Date());
      console.log("Activity data: ", data);
      if (error || !data) {
        console.log("Error fetching meal data: ", error);
        return;
      } else {
        setActivities(data);
      }
    };

    fetchSleepData();
    fetchMealData();
    fetchActivityData();
  }, []);

  return (
    <>
      {profileModalVisible && (
        <Modal
          animationType='none'
          transparent={true}
          visible={profileModalVisible}
          onRequestClose={() => {
            setProfileModalVisible(!profileModalVisible);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setProfileModalVisible(false)}
          >
            <View style={styles.modalView}>
              <Profile setProfileModalVisible={setProfileModalVisible} />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <ScrollView style={styles.container}>
        <View
          style={{ flexDirection: "row", width: "95%", alignSelf: "center" }}
        >
          <View style={{ flex: 1 }}></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h1}>Today</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => setProfileModalVisible(!profileModalVisible)}
            >
              <AccountIcon />
            </TouchableOpacity>
          </View>
        </View>

        <SleepComponent sleepData={sleepData} />
        <ActivitySection activities={activities} />
        <MealsSection meals={meals} />
      </ScrollView>
      <ReUsableModal modalState={modalState} />
    </>
  );
};

const SleepComponent = ({ sleepData }) => {
  if (!sleepData) {
    return <StatusComponent text={"Loading..."} title={"Sleep"} />;
  }

  if (sleepData.length === 0) {
    return (
      <StatusComponent
        text={"No sleep have been logged for today..."}
        title={"Sleep"}
      />
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.h2}>Sleep</Text>

      {sleepData.map((activity, index) => (
        <View
          key={index}
          style={{
            ...styles.banner,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "40%",
            }}
          >
            <SleepIcon />
            <View style={{ marginLeft: 8 }}>
              <Text>Total sleep </Text>
              <Text>{formatDuration(activity.duration)}</Text>
            </View>
          </View>

          <View>
            <Text>Quality </Text>
            <Text>{parseSleepQuality(activity.quality)}</Text>
          </View>

          <View>
            <Text>Bedtime</Text>
            <Text>{formatTime(activity.time)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const ActivitySection = ({ activities }) => {
  if (!activities) {
    return <StatusComponent text={"Loading..."} title={"Activities"} />;
  }

  if (activities.length === 0) {
    return (
      <StatusComponent
        text={"No activities have been logged for today."}
        title={"Activities"}
      />
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.h2}>Activities</Text>
      {activities.map(
        (
          activity: { description: string; time: number; duration: number },
          index: number
        ) => (
          <View
            key={index}
            style={{
              ...styles.banner,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "40%",
              }}
            >
              <ActivityIcon />
              <Text numberOfLines={2} style={{ marginLeft: 8 }}>
                {activity.description}
              </Text>
            </View>

            <View>
              <Text>Duration:</Text>
              <Text>{Math.floor(activity.duration)} min</Text>
            </View>

            <View>
              <Text>Time:</Text>
              <Text>{formatTime(activity.time)}</Text>
            </View>
          </View>
        )
      )}
    </View>
  );
};

const MealsSection = ({ meals }) => {
  if (!meals) {
    return <StatusComponent text={"Loading..."} title={"Meals"} />;
  }

  if (meals.length === 0) {
    return (
      <StatusComponent
        text={"No meals have been logged for today."}
        title={"Meals"}
      />
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.h2}>Meals</Text>
      {meals.map(
        (meal: { description: string; time: number }, index: number) => (
          <View
            key={index}
            style={{
              ...styles.banner,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "80%",
              }}
            >
              <FoodIconBasic />
              <View style={{ marginLeft: 8 }}>
                <Text numberOfLines={2}>{meal.description}</Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text>Time:</Text>
              <Text>{formatTime(meal.time)}</Text>
            </View>
          </View>
        )
      )}
    </View>
  );
};

const StatusComponent = ({ title, text }) => (
  <View style={styles.section}>
    <Text style={styles.h2}>{title}</Text>
    <View
      style={{
        ...styles.banner,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text>{text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
  },
  section: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
  },
  h1: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  banner: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e9e9e9",
    borderRadius: 5,
    height: 80,
  },
  box: {
    borderWidth: 1,
    borderColor: "red",
    width: "50%",
  },
  modalView: {
    flex: 1,
    alignItems: "flex-end",
    marginTop: "22%",
    marginRight: "3%",
  },
});

export default Log;
