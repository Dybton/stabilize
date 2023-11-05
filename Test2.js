import React from "react";
import { VictoryLine, VictoryChart, VictoryCursorContainer, VictoryLabel, VictoryScatter } from 'victory-native';
import { range, first, last } from 'lodash';
import { View, Text } from 'react-native'
import { useState, useEffect } from "react"
import { Button, Dimensions } from 'react-native'
import * as Haptics from 'expo-haptics';


const allData = range(750).map((x) => ({x, y: x + 30 * Math.random()}));

const findClosestPointSorted = (data, value) => {
  if (value === null) return null;
  const start = first(data).x;
  const range = (last(data).x - start);
  const index = Math.round((value - start)/range * (data.length - 1));
  return data[index];
};

export const Test2 = () => {
    const [activePoint, setActivePoint] = useState(null);
  
    const handleCursorChange = (value) => {
      setActivePoint(findClosestPointSorted(allData, value));
    };
  
    const point = activePoint ?
      <VictoryScatter data={[activePoint]} style={{data: {size: 100} }}/>
      : null;
  
    return (
      <View>
        {/* <VictoryChart>
          <VictoryCursorContainer
            dimension="x"
            onChange={handleCursorChange}
            cursorLabel={cursor => `${activePoint ? `${activePoint.x}, ${Math.round(activePoint.y)}` : ''}`}
          />
          {allData && <VictoryLine data={allData} style={{data: {stroke: '#999'} }}/>}
          {point}
        </VictoryChart> */}
        <VictoryScatter
  containerComponent={
    <VictoryCursorContainer
        cursorLabel={({ datum }) => `${Number(datum.x).toFixed(2)}, ${Number(datum.y).toFixed(2)}`}
    />
  }
/>
      </View>
    );
  }
