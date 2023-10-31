import React from "react";
import { useState, useEffect } from "react";
import { Dimensions } from 'react-native';

import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { VictoryBar, Bar, VictoryChart, VictoryTheme, VictoryLine, VictoryLabel, VictoryScatter, VictoryVoronoiContainer, VictoryAxis} from "victory-native";

export const Testo = () => {

    const [draggedPoint, setDraggedPoint] = useState({ x: 1, y: 2 });

    const handleDrag = (event, data) => {
      const { x } = data;
      // Update y based on your curve function
      const y = curveFunction(x);
      setDraggedPoint({ x, y });
    };

    console.debug("text");

    useEffect(() => {
      console.debug(draggedPoint);
    },[draggedPoint])

  return (
    <>
    {/* <VictoryChart
      theme={VictoryTheme.material}
    >
      <VictoryLine
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc"}
        }}
        interpolation="natural"
        labels={({ datum }) => datum.y}
        data={[
          { x: 1, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 5 },
          { x: 4, y: 4 },
          { x: 5, y: 7 }
        ]}
      />
      <VictoryScatter
        style={{ data: { fill: "#c43a31" } }}
        size={7}
        data={[
          { x: 1, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 5 },
          { x: 4, y: 4 },
          { x: 5, y: 7 }
        ]}
        events={[{
          target: 'data',
          eventHandlers: {
            onClick: () => {
              console.log('onMouseDown');
              return [
                {
                  target: 'data',
                  mutation: (props) => {
                    console.debug(props);
                    console.debug("hey ");
                    const { x, y } = props.datum;
                    setDraggedPoint({ x, y });
                    return null;
                  }
                }
              ];
            },
          }
        }]}
      />


    </VictoryChart>
    <Text>{draggedPoint.x} </Text> */}
    
    <View style={{ flex: 1, alignItems: 'center', marginTop: 50, borderWidth: 1, borderColor: '#000'}}>
  <TouchableOpacity onPress={() => console.debug("hey")}>
  <VictoryChart
   domainPadding={{ x: 25, y: 25 }}
    width={Dimensions.get('window').width * 1.38 } 
    height={400}
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
          labels={({ datum }) => datum.y}
          data={[
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

          ]}
        />
        <VictoryScatter
          style={{ data: { fill: "#c43a31" } }}
          size={3}
          data={[
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

          ]}
          labels={() => null}
          events={[{
            target: 'data',
            eventHandlers: {
              onPressIn: () => {
                return [
                  {
                    target: 'data',
                    mutation: (props) => {
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
</View>
  

    </>
  );
}

export default Testo;