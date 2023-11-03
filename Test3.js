
import React, { useEffect } from "react";
import { VictoryLine, VictoryChart, VictoryCursorContainer, VictoryScatter } from 'victory-native';
import { View, Text } from 'react-native'
import { useState  } from "react"
import { Button } from 'react-native'
import * as Haptics from 'expo-haptics';

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

  // we need to format the app correctly
  // then we need to create events that we can display

  const findClosestPoint = (data, value) => {
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
  }

export const Test3 = () => {
    const [cursorValue, setCursorValue] = useState(null);
    const [chartData, setChartData] = useState(data2);
    const [pressed, setPressed] = useState(false);

    const changeData = (data) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        setChartData(data)
      }
    
    return (
    <View
         
      >
      <VictoryChart domainPadding={{ y: 10 }} 
        {...(pressed ? {} : { animate: { duration: 500 } })}
        containerComponent={
          <VictoryCursorContainer
            onCursorChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                setCursorValue(value)
                
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
        <VictoryLine
            data={chartData}
            y={(datum) => datum.y}
        />
        {cursorValue && (
          <VictoryScatter
          data={[findClosestPoint(chartData, cursorValue)]}
          size={7}
          style={{ data: { fill: "red" } }}
        />
        )}
      </VictoryChart>

      <Text>{cursorValue && cursorValue.x}</Text>
      <View style={{flexDirection: 'row'}}>
        <Button onPress={() => changeData(data1)} title={"12H"}></Button>
        <Button onPress={() => changeData(data2)} title={"24H"}></Button>
        <Button onPress={() => changeData(data3)} title={"3D"}></Button>
    </View>
      </View>
    );
