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
import { UserDataContext } from "../contexts/UserDataContext";
import { formatDate } from "../utils/formatDate";
import { compareDates } from "../utils/compareDate";
import { ArrowIconLeft } from "../components/Icons/ArrowIconLeft";
import { ArrowIconRight } from "../components/Icons/ArrowIconRight";

type Sleep = {
  created_at: string;
  duration: number;
  quality: number;
  time: number;
  id: number;
  uid: string;
};

const Log = ({ modalState }) => {
  const [sleep, setSleep] = React.useState(null);
  const [meals, setMeals] = React.useState(null);
  const [activities, setActivities] = React.useState(null);
  const [profileModalVisible, setProfileModalVisible] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  const {
    sleep: sleepDataFromContext,
    meals: mealDataFromContext,
    activities: activityDataFromContext,
  } = useContext(UserDataContext);

  const decrementDate = () => {
    setDate(new Date(date.setDate(date.getDate() - 1)));
  };

  const incrementDate = () => {
    setDate(new Date(date.setDate(date.getDate() + 1)));
  };

  useEffect(() => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const filteredMeals = mealDataFromContext.filter((meal) => {
      const mealTime = new Date(meal.time);
      return mealTime >= startOfDay && mealTime <= endOfDay;
    });

    const filteredActivities = activityDataFromContext.filter((activity) => {
      const activityTime = new Date(activity.time);
      return activityTime >= startOfDay && activityTime <= endOfDay;
    });

    sleepDataFromContext && setSleep(sleepDataFromContext);
    mealDataFromContext && setMeals(filteredMeals);
    activityDataFromContext && setActivities(filteredActivities);
  }, [
    sleepDataFromContext,
    mealDataFromContext,
    activityDataFromContext,
    date,
  ]);

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
          <LogHeader
            date={date}
            decrementDate={decrementDate}
            incrementDate={incrementDate}
          />
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

        <SleepComponent sleep={sleep} modalState={modalState} />
        <ActivitySection activities={activities} modalState={modalState} />
        <MealsSection meals={meals} modalState={modalState} />
      </ScrollView>
      <ReUsableModal modalState={modalState} />
    </>
  );
};

const SleepComponent = ({ sleep, modalState }) => {
  const { setSleepModalVisible, currentSleep, setCurrentSleep } = modalState;
  if (!sleep) {
    return <StatusComponent text={"Loading..."} title={"Sleep"} />;
  }

  if (sleep.length === 0) {
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

      {sleep.map((activity: Sleep, index: number) => (
        <TouchableOpacity
          onPress={() => {
            setSleepModalVisible(true);
            setCurrentSleep(activity);
          }}
        >
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
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const ActivitySection = ({ activities, modalState }) => {
  const { setActivityModalVisible, setCurrentActivity } = modalState;

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
          <TouchableOpacity
            onPress={() => {
              setActivityModalVisible(true);
              setCurrentActivity(activity);
            }}
          >
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
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const MealsSection = ({ meals, modalState }) => {
  const { setAddFoodModalVisible, setCurrentMeal, currentMeal } = modalState;

  useEffect(() => {
    console.log("currentMeal");
    console.log(currentMeal);
  }, [currentMeal]);

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
        (meal: { description: string; time: number }, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setAddFoodModalVisible(true);
                setCurrentMeal(meal);
              }}
            >
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
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
};

const LogHeader = ({ date, decrementDate, incrementDate }) => {
  const isToday = compareDates(date, new Date()) === 0;

  return (
    <View>
      <View
        style={{
          width: 180,
          marginTop: 10,
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={decrementDate}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            minHeight: 50, // Ensure minimum height for the container
          }}
        >
          <ArrowIconLeft />
        </TouchableOpacity>
        <Text
          style={[
            styles.h2,
            { flex: 1, textAlign: "center", position: "absolute" },
          ]}
        >
          {formatDate(date)}
        </Text>

        {!isToday && (
          <TouchableOpacity
            onPress={incrementDate}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <ArrowIconRight />
          </TouchableOpacity>
        )}
      </View>
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
