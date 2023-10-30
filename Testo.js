import React from "react";
import { useState, useEffect } from "react";

import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { VictoryBar, Bar, VictoryChart, VictoryTheme, VictoryLine, VictoryLabel, VictoryScatter, VictoryVoronoiContainer} from "victory-native";


// On click I wish to print the x, y coordinates of the point clicked

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
    
<TouchableOpacity onPress={() => console.debug("hey")}>
<VictoryChart>

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
  

    </>
  );
}

export default Testo;