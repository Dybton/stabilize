
import React, { useEffect } from "react";
import { VictoryLine, VictoryChart, VictoryCursorContainer, VictoryScatter, VictoryAxis } from 'victory-native';
import { View, Text} from 'react-native'
import { useState  } from "react"
import { Button } from 'react-native'
import * as Haptics from 'expo-haptics';
import { Dimensions } from 'react-native'
import CustomButton from "./components/CustomButton";


// Buttons
// Events
// Ticks


const data1 = [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 },
    { x: 6, y: 7.5 }, 
    { x: 7, y: 8 }, 
    { x: 8, y: 8.5 }, 
    { x: 9, y: 8.5 }, 
    { x: 10, y: 6},
    { x: 11, y: 6.5 },
    { x: 12, y: 7 },
  ]

  const data2 = [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 },
    { x: 6, y: 7.5 }, 
    { x: 7, y: 8 }, 
    { x: 8, y: 8.5 }, 
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
    const [chartData, setChartData] = useState(data2);
    const [cursorValue, setCursorValue] = useState(null);
    const [pressed, setPressed] = useState(false);
    const [averageGL, setAverageGL] = useState(0)
    const [timeframe, setTimeframe] = useState("12H") // make this into an enum
    


    useEffect(() => {
        const val =  chartData[chartData.length - 1].x
        if(!cursorValue)
            setCursorValue({x: val, y: chartData[chartData.length - 1].y})

        if(chartData){
            setAverageGL(calculateAverageGL(chartData))
        }

    },[])

    const calculateAverageGL = (data) => {
        if(!chartData)
            return
        let sum = 0
        let count = 0
        for(let i = 0; i < data.length; i++){
            sum += data[i].y
            count++
        }
        return sum/count
    }

    const changeData = (data) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        setChartData(data)
      }
    
    return (
    <View style={{ flex: 1, marginTop: 50, width: Dimensions.get('window').width }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center' }}>12 Hour Average</Text>
            <Text style={{ textAlign: 'center' }}><Text style={{fontSize: 20}}>{averageGL.toFixed(1)}</Text> mmol/L</Text>
        </View>
        <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center' }}>Glucose level:  </Text>
            <Text style={{ textAlign: 'center' }}><Text style={{fontSize: 20}}>{cursorValue && cursorValue.y.toFixed(1)} </Text> mmol/L</Text>
        </View>
    </View>
    <View style={{ marginTop: 30}}>
      <VictoryChart
      domainPadding={{ y: [30, 30]}} 
      width={Dimensions.get('window').width} 
      padding={{ top: 0, bottom: 30, left: 0, right:0 }}
        height={Dimensions.get('window').height * 0.5} // 50% of the screen height
        {...(pressed ? {} : { animate: { duration: 400 } })}
        
        containerComponent={
          <VictoryCursorContainer
            onCursorChange={(value) => {
                if (value) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                setCursorValue(value)
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
            interpolation="natural"
        />
        {cursorValue && pressed && (
          <VictoryScatter
          data={[findClosestPoint(chartData, cursorValue)]}
          size={7}
          style={{ data: { fill: "red" } }}
        />
        )}
      </VictoryChart>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>

        <CustomButton data={data1} handleClick={changeData} text={"12H"} timeframe={timeframe} setTimeframe={setTimeframe}/>
        <CustomButton data={data2} handleClick={changeData} text={"24H"} timeframe={timeframe} setTimeframe={setTimeframe}/>
        <CustomButton data={data3} handleClick={changeData} text={"3D"} timeframe={timeframe} setTimeframe={setTimeframe}/>
        <CustomButton data={data1} handleClick={changeData} text={"7D"} timeframe={timeframe} setTimeframe={setTimeframe}/>
        <CustomButton data={data1} handleClick={changeData} text={"14D"} timeframe={timeframe} setTimeframe={setTimeframe}/>
        {/* <Button onPress={() => changeData(data2)} title={"24H"} color="black"></Button>
        <Button onPress={() => changeData(data3)} title={"3D"} color="black"></Button>
        <Button onPress={() => changeData(data3)} title={"7D"} color="black"></Button>
        <Button onPress={() => changeData(data3)} title={"14D"} color="black"></Button> */}
    </View>
      </View>
    );
  }

  

  
