import React from "react";
import { useState, useEffect } from "react"
import { Button, Dimensions } from 'react-native'
import * as Haptics from 'expo-haptics';



import { Text, View, TouchableOpacity} from 'react-native';

import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis} from "victory-native";

const data1 = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 2.5, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 },
  { x: 6, y: 7.5 }, 
  { x: 7, y: 8 }, 
  { x: 8, y: 8.5 }, 
  { x: 9, y: 10 },
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
]

const data3 = [
  { x: 1, y: 1 },
  { x: 3, y: 2.5 },
  { x: 3.5, y: 3 },
  { x: 4, y: 5 },
  { x: 5, y: 4 },
  { x: 6, y: 7.5 }, 
  { x: 7, y: 8 }, 
  { x: 8, y: 8.5 }, 
  { x: 9, y: 9.5 },
  { x: 10, y: 10 },
  { x: 11, y: 11 },
]

export const Testo = () => {

    const [draggedPoint, setDraggedPoint] = useState({ x: 1, y: 2 });
    const [chartData, setChartData] = useState(data1)

    const changeData = (data) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setChartData(data)
    }

  return (
    <>
    <View style={{ flex: 1, alignItems: 'center', marginTop: 50, borderWidth: 1, borderColor: '#000'}}>
  <TouchableOpacity>
  <VictoryChart
   domainPadding={{ x: 25, y: 25 }}
    width={Dimensions.get('window').width * 1.38 } 
    height={400}
    animate={{ duration: 250 }}
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
          size={8}
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

    </VictoryChart>
    </TouchableOpacity>
    <Text>{draggedPoint.x}  {draggedPoint.y} </Text>
    <View style={{flexDirection: 'row'}}>
    <Button onPress={() => changeData(data1)} title={"12H"}></Button>
    <Button onPress={() => changeData(data2)} title={"24H"}></Button>
    <Button onPress={() => changeData(data3)} title={"3D"}></Button>
    <Button onPress={() => changeData(data3)} title={"7D"}></Button>
    <Button onPress={() => changeData(data3)} title={"14D"}></Button>
    </View>
</View>
  

    </>
  );
}

export default Testo;