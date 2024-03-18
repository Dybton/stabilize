import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

// Make this generic such that it takes a type and an icon
const GraphActivityIcon = ({ x, y, highlightEvent }) => {
  const [iconSize, setIconSize] = useState(20);

  useEffect(() => {
    if (highlightEvent) {
      setIconSize(30);
    } else {
      setIconSize(20);
    }
  }, [highlightEvent]);

  return (
    <View
      style={{
        position: "absolute",
        left: x - iconSize / 2,
        top: y - iconSize / 2,
      }}
    >
      <Svg width={iconSize} height={iconSize} viewBox='0 0 24 24' fill='none'>
        <Circle cx='12' cy='12' r='12' fill='#D9D9D9' />
        <G transform='scale(0.8) translate(3,5)'>
          <Path
            d='M18.57 12.86L20 11.43L18.57 10L15 13.57L6.43 5L10 1.43L8.57 0L7.14 1.43L5.71 0L3.57 2.14L2.14 0.71L0.71 2.14L2.14 3.57L0 5.71L1.43 7.14L0 8.57L1.43 10L5 6.43L13.57 15L10 18.57L11.43 20L12.86 18.57L14.29 20L16.43 17.86L17.86 19.29L19.29 17.86L17.86 16.43L20 14.29L18.57 12.86Z'
            fill='black'
          />
        </G>
      </Svg>
    </View>
  );
};

export default GraphActivityIcon;
