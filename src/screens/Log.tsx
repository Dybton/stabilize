import React, { useEffect, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import FoodIconBasic from "../components/Icons/FoodIconBasic";
import ActivityIcon from "../components/Icons/ActivityIcon";
import SleepIcon from "../components/Icons/SleepIcon";
import { supabase } from "../api/supabaseClient";
import { yesterdayTimeStamp } from "../utils/yesterdayTimeStamp";
import { formatTime } from "../utils/formatTime";

const sleepData = {
  total: "7h 12m",
  quality: 8,
  bedTime: "22:44",
};

const Log = () => {
  const [sleepData2, setSleepData] = React.useState(null);
  const [meals, setMeals] = React.useState(null);
  const [activities, setActivities] = React.useState(null);

  useEffect(() => {
    const fetchSleepData = async () => {
      const { data, error } = await supabase.from("sleep").select("*");
      if (error || !data) {
        // To do: Get the right sleep data
        console.log("Error fetching sleep data: ", error);
        return;
      } else {
        console.log("Sleep data: ", data);
        setSleepData(data);
      }
    };

    const fetchMealData = async () => {
      const { data, error } = await supabase.from("meals").select("*");
      if (error || !data) {
        console.log("Error fetching meal data: ", error);
        return;
      } else {
        setMeals(data);
      }
    };

    const fetchActivityData = async () => {
      const { data, error } = await supabase.from("activities").select("*");
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
    <ScrollView style={styles.container}>
      <Text style={styles.h1}>Today</Text>
      <SleepComponent sleepData={sleepData} />
      <ActivitySection activities={activities} />
      <MealsSection meals={meals} />
    </ScrollView>
  );
};

const SleepComponent = ({ sleepData }) => {
  return (
  <View style={styles.section}>
      <Text style={styles.h2}>Sleep</Text>
    <View
      style={{
        ...styles.banner,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <SleepIcon />
      </View>

      <View style={{ flex: 3 }}>
        <Text>Total sleep </Text>
        <Text>{sleepData.total}</Text>
      </View>

      <View style={{ flex: 2 }}>
        <Text>Quality </Text>
        <Text>{sleepData.quality}/10</Text>
      </View>

      <View style={{ flex: 1.5 }}>
        <Text>Bed time</Text>
        <Text>{sleepData.bedTime}</Text>
      </View>
    </View>
  </View>
);
};

const ActivitySection = ({ activities }) => {
  if (!activities) {
    return <Text>Loading...</Text>;
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
    return <Text>Loading...</Text>;
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
});

export default Log;
