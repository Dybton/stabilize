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
import glucoseData from "../../DummyData";
import dummyGlucoseData from "../../DummyData2";
import { getGlucoseDataForPeriod } from "../utils/getGlucoseDataForPeriod";
import { GlucoseData, GlucoseEvent } from "../../Types";
import timestamps from "../../DummyData";
import ReUsableModal from "../components/ReUsableModal";
import { supabase } from "../api/supabaseClient";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";

// also, we only need to show the event if it's within the timeframe
const timeFrameDict = {
  "12H": 12 * 60 * 60 * 1000,
  "24H": 24 * 60 * 60 * 1000,
  "3D": 3 * 24 * 60 * 60 * 1000,
  "7D": 7 * 24 * 60 * 60 * 1000,
  "14D": 14 * 24 * 60 * 60 * 1000,
};

const findClosestPoint = (data: GlucoseData, value: GlucoseEvent) => {
  if (!data) return;
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

// we need to get the highlighting to work

export const GlucoseLevelChart = ({ modalState }) => {
  const yesterDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const { meals: mealDataFromContext, activities: activityDataFromContext } =
    useContext(UserDataContext);

  const { userSession } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [pressed, setPressed] = useState(false);
  const [averageGL, setAverageGL] = useState(0);
  const [timeframe, setTimeframe] = useState<string>("12H"); // make this into an enum
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [chartData, setChartData] = useState(timestamps);
  const [cursorValue, setCursorValue] = useState<{
    x: number;
    y: number | undefined;
  }>();

  // This should be done in the backend
  const hours12data: GlucoseData = useMemo(
    () =>
      getGlucoseDataForPeriod(
        dummyGlucoseData,
        new Date(yesterDay.getTime() - 12 * 60 * 60 * 1000),
        new Date()
      ),
    [glucoseData]
  );

  const hours24data: GlucoseData = useMemo(
    () =>
      getGlucoseDataForPeriod(
        dummyGlucoseData,
        new Date(yesterDay.getTime() - 24 * 60 * 60 * 1000),
        new Date()
      ),
    [glucoseData]
  );
  const days3data: GlucoseData = useMemo(
    () =>
      getGlucoseDataForPeriod(
        dummyGlucoseData,
        new Date(yesterDay.getTime() - 3 * 24 * 60 * 60 * 1000),
        new Date()
      ).filter((_, index) => index % 2 === 0),
    [glucoseData]
  );
  const days7data: GlucoseData = useMemo(
    () =>
      getGlucoseDataForPeriod(
        dummyGlucoseData,
        new Date(yesterDay.getTime() - 7 * 24 * 60 * 60 * 1000),
        new Date()
      ).filter((_, index) => index % 5 === 0),
    [glucoseData]
  );
  const days14data: GlucoseData = useMemo(
    () =>
      getGlucoseDataForPeriod(
        dummyGlucoseData,
        new Date(yesterDay.getTime() - 14 * 24 * 60 * 60 * 1000),
        new Date()
      ).filter((_, index) => index % 9 === 0),
    [glucoseData]
  );

  const changeData = (data: GlucoseData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setChartData(data);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const formattedMealEvents = mealDataFromContext.map((event) => {
        const time = new Date(event.time).getTime();

        return {
          x: time,
          y: findClosestPoint(chartData, { x: time, y: undefined }).y,
          description: event.description,
          type: "meal",
        };
      });

      const formattedActivityEvents = activityDataFromContext.map((event) => {
        const time = new Date(event.time).getTime();
        return {
          x: time,
          y: findClosestPoint(chartData, { x: time, y: undefined }).y,
          description: event.description,
          type: "activity",
        };
      });

      setEvents([...formattedMealEvents, ...formattedActivityEvents]);
    };

    fetchEvents();
  }, [mealDataFromContext, activityDataFromContext]);

  useEffect(() => {
    if (chartData.length > 0) {
      const val = chartData[chartData.length - 1].x;
      if (!cursorValue)
        setCursorValue({ x: val ?? 0, y: chartData[chartData.length - 1].y });
    }
  }, [cursorValue, chartData]);

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
            {/* <Text style={{ textAlign: 'center' }}>12 Hour Average</Text>
            <Text style={{ textAlign: 'center' }}><Text style={{fontSize: 20}}>{averageGL.toFixed(1)}</Text> mmol/L</Text> */}
            <Text style={{ textAlign: "center" }}>Time:</Text>
            <Text style={{ textAlign: "center" }}>
              {chartData === hours12data || chartData === hours24data ? (
                <Text style={{ fontSize: 20 }}>
                  {cursorValue &&
                    new Date(cursorValue.x).toLocaleTimeString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                </Text>
              ) : (
                <Text style={{ fontSize: 20, position: "absolute" }}>
                  {cursorValue &&
                    new Date(cursorValue.x).toLocaleDateString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
                </Text>
              )}
            </Text>
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
                Dimensions.get("window").height * 0.5,
                Dimensions.get("window").height * 0.1,
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
            <VictoryAxis
              // style={{ axis: { stroke: "none" } }}
              tickFormat={() => null}
            />
            <VictoryLine
              data={chartData}
              y={(datum) => datum.y}
              interpolation='natural'
            />
            {cursorValue && pressed && chartData.length > 0 && (
              <VictoryScatter
                data={[findClosestPoint(chartData, cursorValue)]}
                size={5}
                style={{ data: { fill: "red" } }}
              />
            )}
            {events
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
                        <FoodIcon
                          highlightEvent={highlightEvent}
                          x={undefined}
                          y={undefined}
                        />
                      }
                    />
                  </VictoryGroup>
                );
              })}
          </VictoryChart>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <CustomButton
            data={hours12data}
            handleClick={changeData}
            text={"12H"}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <CustomButton
            data={hours24data}
            handleClick={changeData}
            text={"24H"}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <CustomButton
            data={days3data}
            handleClick={changeData}
            text={"3D"}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <CustomButton
            data={days7data}
            handleClick={changeData}
            text={"7D"}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <CustomButton
            data={days14data}
            handleClick={changeData}
            text={"14D"}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
        </View>

        <View style={styles.container}>
          {/* ... (rest of your views) */}

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
    alignSelf: "center", // Center button horizontally
  },
  eventButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // ... (other styles)
});
