import React from "react";
import { useState, useEffect } from "react"
import { Button, Dimensions } from 'react-native'
import * as Haptics from 'expo-haptics';
import { range, first, last } from 'lodash';



import { Text, View, TouchableOpacity} from 'react-native';

import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis, VictoryCursorContainer, VictoryGroup} from "victory-native";

// I need to ensure the arrays have the same length, otherwise the animation will fuck up
const data1 = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 3, y: 3 },
  { x: 4, y: 5 },
  { x: 5, y: 4 },
  { x: 6, y: 7 },
  { x: 7, y: 7.5 }, 
  { x: 8, y: 8 }, 
  { x: 9, y: 8.5 }, 
  { x: 10, y: 6},
  { x: 11, y: 6.5 },
  { x: 12, y: 7 },
  { x: 13, y: 7.5 },
  { x: 14, y: 8 },
  { x: 15, y: 8.5 },
  { x: 16, y: 9 },
  { x: 17, y: 9.5 },
  { x: 18, y: 10 },
  { x: 19, y: 10.5 },
  { x: 20, y: 11 },
  { x: 21, y: 1 },
  { x: 22, y: 2 },
  { x: 23, y: 3 },
  { x: 24, y: 5 },
  { x: 25, y: 4 },
  { x: 26, y: 7 },
  { x: 27, y: 7.5 }, 
  { x: 28, y: 8 }, 
  { x: 29, y: 8.5 }, 
  { x: 30, y: 6},
  { x: 31, y: 6.5 },
  { x: 32, y: 7 },
  { x: 33, y: 7.5 },
  { x: 34, y: 8 },
  { x: 35, y: 8.5 },
  { x: 36, y: 9 },
  { x: 37, y: 9.5 },
  { x: 38, y: 10 },
  { x: 39, y: 10.5 },
  { x: 40, y: 11 },
]

const data2 = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 2.5, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 },
  { x: 6, y: 7.5 }, 
  { x: 7, y: 8 }, 
  { x: 8, y: 8.5 }, 
  { x: 9, y: 9.5 },
  { x: 10, y: 10 },
  { x: 11, y: 10.5 },
  { x: 12, y: 11 },
  { x: 13, y: 11.5 },
  { x: 14, y: 12 },
  { x: 15, y: 12.5 },
  { x: 16, y: 13 },
  { x: 17, y: 13.5 },
  { x: 18, y: 14 },
  { x: 19, y: 14.5 },
]

const data3 = [
  { x: 1, y: 1 },
  { x: 2, y: 2.5 },
  { x: 2.5, y: 3 },
  { x: 3, y: 3 },
  { x: 4, y: 5 },
  { x: 5, y: 4 },
  { x: 6, y: 2 }, 
  { x: 7, y: 8 }, 
  { x: 8, y: 2 }, 
  { x: 9, y: 9.5 },
  { x: 10, y: 12 },
  { x: 11, y: 12.5 },
  { x: 12, y: 4 },
  { x: 13, y: 13.5 },
  { x: 14, y: 14 },
  { x: 15, y: 14.5 },
  { x: 16, y: 3 },
  { x: 17, y: 15.5 },
  { x: 18, y: 8 },
  { x: 19, y: 16.5 },
]

export const Testo = () => {

    const [draggedPoint, setDraggedPoint] = useState({ x: 1, y: 2 });
    const [chartData, setChartData] = useState(data1)
    const [activePoint, setActivePoint] = useState(null);

    const handleCursorChange = (value) => {
      setActivePoint(findClosestPointSorted(chartData, value));
    };

    const changeData = (data) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setChartData(data)
    }

    const findClosestPointSorted = (data, value) => {
      if (value === null) return null;
      const start = first(data).x;
      const range = (last(data).x - start);
      const index = Math.round((value - start)/range * (data.length - 1));
      return data[index];
    };

  return (
    <>
    <View style={{ flex: 1, alignItems: 'center', marginTop: 50, borderWidth: 1, borderColor: '#000'}}>
  <TouchableOpacity>
  <VictoryChart
   domainPadding={{ x: 25, y: 25 }}
    width={Dimensions.get('window').width * 1.38 } 
    height={400}
    animate={{ duration: 0, easing: 'linear' } }
    containerComponent={
      <VictoryCursorContainer
          onCursorChange={handleCursorChange}
          cursorDimension="x"
      />
    }
   >
     <VictoryAxis
      style={{ axis: { stroke: "none" } }}
      tickFormat={() => null}
    />

  <VictoryLine
    style={{
      data: { stroke: "#c43a31" },
      parent: { border: "1px solid #ccc"}
    }}
    interpolation="natural"
    // labels={({ datum }) => datum.y}
    data={chartData}
  />
  <VictoryScatter
    style={{ data: { fill: "#c43a31" } }}
    size={0}
    data={chartData}  
    labels={() => null}
    events={[{
      target: 'data',
      eventHandlers: {
        onPressIn: () => {
          return [
            {
              target: 'data',
              mutation: (props) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                const { x, y } = props.datum;
                setDraggedPoint({ x, y });
                const fillColor = props.style && props.style.fill;
                return fillColor === "black" 
                  ? { style: { fill: "red" } } 
                  : { style: { fill: "black" }, size: 9 };
              }
            }
          ];
        },
      }
    }]}
  />
    <VictoryScatter
      data={[activePoint]}
      style={{ data: { fill: "blue" } }}
      size={3}
    />

    </VictoryChart>
    </TouchableOpacity>
    <Text>{draggedPoint.x}  {draggedPoint.y} </Text>
    <Text>{activePoint ? activePoint.x : null}  {activePoint ? activePoint.y : null} </Text>
    <View style={{flexDirection: 'row'}}>
    <Button onPress={() => changeData(data1)} title={"12H"}></Button>
    <Button onPress={() => changeData(data2)} title={"24H"}></Button>
    <Button onPress={() => changeData(data3)} title={"3D"}></Button>
    </View>
</View>
  

    </>
  );
}

export default Testo;