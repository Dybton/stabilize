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

// Main Log component
const Log = () => {
  return (
    <ScrollView style={styles.container}>
      <SleepSection sleepData={sleepData} />
      <ActivitySection activities={activities} />
      <MealsSection meals={meals} />
      {/* Add any additional sections or components here */}
    </ScrollView>
  );
};

// Subcomponent for displaying sleep information
const SleepSection = ({ sleepData }) => (
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
      <View>
        <BookIcon />
      </View>

      <View>
        <Text>Total sleep </Text>
        <Text>{sleepData.total}</Text>
      </View>

      <View>
        <Text>Quality </Text>
        <Text>{sleepData.quality}/10</Text>
      </View>

      <View>
        <Text>Bed time</Text>
        <Text>{sleepData.bedTime}</Text>
      </View>

      <View>
        <BookIcon />
      </View>
    </View>
  </View>
);

// Subcomponent for displaying activity information
const ActivitySection = ({ activities }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Activity</Text>
    {activities.map((activity, index) => (
      <View key={index} style={styles.banner}>
        <Text>Training: {activity.name}</Text>
        <Text>Duration: {activity.duration}</Text>
        <Text>Time: {activity.time}</Text>
      </View>
    ))}
  </View>
);

// Subcomponent for displaying meal information
const MealsSection = ({ meals }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Meals</Text>
    {meals.map((meal, index) => (
      <View key={index} style={styles.banner}>
        <Text>Food: {meal.description}</Text>
        <Text>Time: {meal.time}</Text>
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
});

export default Log;
