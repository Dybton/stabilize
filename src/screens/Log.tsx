import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { BookIcon } from "../components/Icons/BookIcon";

const sleepData = {
  total: "7h 12m",
  quality: 8,
  bedTime: "22:44",
};

const activities = [
  { name: "Upper body workout", duration: "1h", time: "22:44" },
  // Add more activities as needed
];

const meals = [
  {
    description:
      "Mixed salad, carrots, cucumbers, feta, avocado, spinach, and small falafels with hummus",
    time: "22:44",
  },
  { description: "A cup of herbal tea", time: "22:44" },
  {
    description:
      "Mixed salad, red bell peppers, feta, tomatoes, chicken breast, croutons, and mayo dressing",
    time: "22:44",
  },
  // Add more meals as needed
];

const Log = () => {
  return (
    <ScrollView style={styles.container}>
      <SleepComponent sleepData={sleepData} />
      <ActivitySection activities={activities} />
      <MealsSection meals={meals} />
    </ScrollView>
  );
};

const SleepComponent = ({ sleepData }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Sleep</Text>
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
        <BookIcon />
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

const ActivitySection = ({ activities }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Activity</Text>
    {activities.map(
      (
        activity: { name: string; duration: string; time: string },
        index: number
      ) => (
        <View
          key={index}
          style={{
            ...styles.banner,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <BookIcon />
          </View>

          <View style={{ flex: 4 }}>
            <Text>Activity:</Text>
            <Text>{activity.name}</Text>
          </View>

          <View style={{ flex: 1.2, marginLeft: 5 }}>
            <Text>Duration:</Text>
            <Text>{activity.duration}</Text>
          </View>
        </View>
      )
    )}
  </View>
);

// Subcomponent for displaying meal information
const MealsSection = ({ meals }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Meals</Text>
    {meals.map((meal: { description: string; time: string }, index: number) => (
      <View
        key={index}
        style={{
          ...styles.banner,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <BookIcon />
        </View>

        <View style={{ flex: 4 }}>
          <Text>Food:</Text>
          <Text numberOfLines={2}>{meal.description}</Text>
        </View>

        <View style={{ flex: 1.2, marginLeft: 5 }}>
          <Text>Time:</Text>
          <Text>{meal.time}</Text>
        </View>
      </View>
    ))}
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
  title: {
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
