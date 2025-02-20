import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  VictoryLine,
  VictoryChart,
  VictoryCursorContainer,
  VictoryScatter,
  VictoryAxis,
  VictoryGroup,
} from "victory-native";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { Dimensions } from "react-native";
import CustomButton from "../components/CustomButton";
import FoodIcon from "../components/Icons/FoodIcon";
import { StyleSheet } from "react-native";
import { GlucoseData, GlucoseEvent } from "../Types";
import ReUsableModal from "../components/ReUsableModal";
import { supabase } from "../api/supabaseClient";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";
import GraphActivityIcon from "../components/Icons/GraphActivityIcon";
import { formatTime } from "../utils/formatTime";
import { AppState } from "react-native";
import { formatDate } from "../utils/formatDate";

const timeFrameDict = {
  "12H": 12 * 60 * 60 * 1000,
  "24H": 24 * 60 * 60 * 1000,
  "3D": 3 * 24 * 60 * 60 * 1000,
  "7D": 7 * 24 * 60 * 60 * 1000,
  "14D": 14 * 24 * 60 * 60 * 1000,
};

const fetchServerData = async (param: string) => {
  const url = `http://nodejs-production-ec50.up.railway.app/sync/${param}`;
  console.log(`Fetching data from: ${url}`);
  try {
    const response = await fetch(url);
    const data = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${data}`);
    }
    console.log("Data fetched from server:", data);
    return data; // Assuming you might want to use this data
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

const findClosestPoint = (data: GlucoseData, value: GlucoseEvent) => {
  if (!data || data.length === 0) return null;
  let closestPoint = data[0];
  let closestDistance = Math.abs(data[0].x - value.x);

  for (let i = 1; i < data.length; i++) {
    let distance = Math.abs(data[i].x - value.x);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = data[i];
    }
  }
  return closestPoint;
};

const filterDataByTimestamp = (
  timestamp: number,
  data: { glucose_level: number; measurement_timestamp: string }[]
) => {
  return data
    .filter((item) => {
      const itemTimestamp = new Date(item.measurement_timestamp).getTime();
      return itemTimestamp >= timestamp;
    })
    .map((item) => ({
      y: item.glucose_level,
      x: new Date(item.measurement_timestamp).getTime(),
    }))
    .sort((a, b) => a.x - b.x);
};

export const GlucoseLevelChart = ({ modalState }) => {
  const { userSession } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [formattedEvents, setFormattedEvents] = useState([]);
  const [pressed, setPressed] = useState(false);
  const [timeframe, setTimeframe] = useState<string>("12H");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [glucoseTwelveHours, setGlucoseTwelveHours] = useState([]);
  const [glucoseTwentyFourHours, setGlucoseTwentyFourHours] = useState([]);
  const [glucoseThreeDays, setGlucoseThreeDays] = useState([]);
  const [appState, setAppState] = useState(AppState.currentState);

  const [chartData, setChartData] = useState([]);
  const [cursorValue, setCursorValue] = useState<{
    x: number;
    y: number | undefined;
  }>();

  const changeData = (data: GlucoseData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setChartData(data);
  };

  const { meals: mealDataFromContext, activities: activityDataFromContext } =
    useContext(UserDataContext);

  useEffect(() => {
    if (!chartData || chartData.length === 0) return;
    const formattedMealEvents = mealDataFromContext
      .map((event) => {
        const time = new Date(event.time).getTime();

        return {
          x: time,
          y: findClosestPoint(chartData, { x: time, y: undefined }).y,
          description: event.description,
          type: "meal",
        };
      })
      .filter(
        (event) =>
          event.x >= chartData[0].x &&
          event.x <= chartData[chartData.length - 1].x
      );

    const formattedActivityEvents = activityDataFromContext
      .map((event) => {
        const time = new Date(event.time).getTime();
        return {
          x: time,
          y: findClosestPoint(chartData, { x: time, y: undefined }).y,
          description: event.description,
          type: "activity",
        };
      })
      .filter(
        (event) =>
          event.x >= chartData[0].x &&
          event.x <= chartData[chartData.length - 1].x
      );

    mealDataFromContext &&
      activityDataFromContext &&
      setFormattedEvents([...formattedMealEvents, ...formattedActivityEvents]);
  }, [mealDataFromContext, activityDataFromContext, chartData]);

  const fetchGlucoseMeasurements = async () => {
    if (!userSession) return;
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("patient_id")
      .eq("user_id", userSession.id)
      .single();

    if (userError || !userData) {
      console.log("Error fetching user or no user data: ", userError);
      return;
    }

    userData.patient_id && (await fetchServerData(userData.patient_id));

    const seventyTwoHoursAgo = new Date(
      new Date().getTime() - 72 * 60 * 60 * 1000
    ).toISOString();

    const { data: glucoseMeasurements, error: glucoseError } = await supabase
      .from("glucose_measurements")
      .select("glucose_level, measurement_timestamp")
      .eq("patient_id", userData.patient_id)
      .gte("measurement_timestamp", seventyTwoHoursAgo);

    if (glucoseError) {
      console.log("Error fetching glucose measurements: ", glucoseError);
    } else {
      const twelveHoursAgo = new Date().getTime() - 12 * 60 * 60 * 1000;
      const twentyFourHoursAgo = new Date().getTime() - 24 * 60 * 60 * 1000;
      const threeDaysAgo = new Date().getTime() - 3 * 24 * 60 * 60 * 1000;
      const twelveHoursData = filterDataByTimestamp(
        twelveHoursAgo,
        glucoseMeasurements
      );
      const twentyFourHoursData = filterDataByTimestamp(
        twentyFourHoursAgo,
        glucoseMeasurements
      );
      const threeDaysData = filterDataByTimestamp(
        threeDaysAgo,
        glucoseMeasurements
      );

      setGlucoseTwelveHours(twelveHoursData);
      setGlucoseTwentyFourHours(twentyFourHoursData);
      setGlucoseThreeDays(threeDaysData);
      setChartData(twelveHoursData);
    }
  };

  useEffect(() => {
    fetchGlucoseMeasurements();
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", (state) => {
      if (state === "active") {
        fetchGlucoseMeasurements();
      }
      setAppState(state);
    });
  }, []);

  useEffect(() => {
    if (
      glucoseTwelveHours.length > 0 ||
      glucoseTwentyFourHours.length > 0 ||
      glucoseThreeDays.length > 0
    )
      setLoading(false);
  }, [glucoseTwelveHours]);

  useEffect(() => {
    if (chartData.length > 0) {
      const val = chartData[chartData.length - 1].x;
      if (!cursorValue)
        setCursorValue({ x: val ?? 0, y: chartData[chartData.length - 1].y });
    }
  }, [cursorValue, chartData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          marginTop: 50,
          width: Dimensions.get("window").width,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: "center" }}>Measurement Time:</Text>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20 }}>
                {cursorValue && formatTime(cursorValue.x)}
              </Text>
              <Text style={{ fontSize: 20 }}>
                {cursorValue && formatDate(cursorValue.x, false)}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: "center" }}>Glucose level: </Text>
            <Text style={{ textAlign: "center" }}>
              <Text style={{ fontSize: 20 }}>
                {cursorValue && cursorValue.y.toFixed(1)}{" "}
              </Text>{" "}
              mmol/L
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <VictoryChart
            domainPadding={{
              y: [
                Dimensions.get("window").height,
                Dimensions.get("window").height,
              ],
            }}
            width={Dimensions.get("window").width}
            padding={{ top: 0, bottom: 30, left: 0, right: 0 }}
            height={Dimensions.get("window").height * 0.5}
            {...(pressed ? {} : { animate: { duration: 200 } })}
            containerComponent={
              <VictoryCursorContainer
                onCursorChange={(value: GlucoseEvent) => {
                  if (value) {
                    const closestPoint =
                      value &&
                      value.x &&
                      value.y &&
                      findClosestPoint(chartData, value);
                    const yValue = closestPoint ? closestPoint.y : value.y;

                    setCursorValue({
                      x: value.x,
                      y: yValue,
                    });
                  }
                }}
                onTouchEnd={() => {
                  setPressed(false);
                }}
                onTouchStart={() => {
                  setPressed(true);
                }}
              />
            }
          >
            <VictoryAxis tickFormat={() => null} />
            <VictoryLine
              data={chartData}
              y={(datum) => datum.y}
              interpolation='basis'
            />
            {cursorValue && pressed && chartData.length > 0 && (
              <VictoryScatter
                data={[findClosestPoint(chartData, cursorValue)]}
                size={5}
                style={{ data: { fill: "red" } }}
              />
            )}
            {formattedEvents &&
              formattedEvents
                .filter((event) => {
                  const timeframeStart =
                    new Date().getTime() - timeFrameDict[timeframe]; // 12 hours in milliseconds
                  return event.x >= timeframeStart;
                })
                .map((event, index) => {
                  const highlightEvent =
                    cursorValue &&
                    cursorValue.x >= event.x - 0.5 &&
                    cursorValue.x <= event.x + 0.5;

                  // useEffect(() => {
                  //   if (highlightEvent) setSelectedEvent(index);
                  //   // Haptic feedback
                  // }, [highlightEvent]);

                  return (
                    <VictoryGroup animate={false} key={index}>
                      <VictoryScatter
                        data={[event]}
                        dataComponent={
                          event.type === "meal" ? (
                            <FoodIcon
                              highlightEvent={highlightEvent}
                              x={undefined}
                              y={undefined}
                            />
                          ) : (
                            <GraphActivityIcon
                              highlightEvent={highlightEvent}
                              x={undefined}
                              y={undefined}
                            />
                          )
                        }
                      />
                    </VictoryGroup>
                  );
                })}
          </VictoryChart>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <CustomButton
            data={glucoseTwelveHours}
            handleClick={changeData}
            text={"12H"}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <CustomButton
            data={glucoseTwentyFourHours}
            handleClick={changeData}
            text={"24H"}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <CustomButton
            data={glucoseThreeDays}
            handleClick={changeData}
            text={"72H"}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
        </View>
        {events &&
          events.map((event, index) => (
            <Text key={index}>{event.description}</Text>
          ))}

        <View style={styles.container}>
          {selectedEvent !== null && (
            <TouchableOpacity
              style={styles.eventButton}
              onPress={() => console.log(`Go Event ${selectedEvent} pressed`)}
              activeOpacity={0.7}
            >
              <Text
                style={styles.eventButtonText}
              >{`Go to Event ${selectedEvent}`}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ReUsableModal modalState={modalState} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    width: Dimensions.get("window").width,
  },
  eventButton: {
    marginTop: 20,
    backgroundColor: "#007bff", // Bootstrap primary button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    alignSelf: "center",
  },
  eventButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
