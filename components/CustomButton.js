import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';

const CustomButton = ({data, handleClick, text}) => {
    const [pressed, setPressed] = useState(false);


    return (
    <TouchableOpacity 
      onPress={() => handleClick(data)} 
      style={{
        borderRadius: 50,
        backgroundColor: 'grey',
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{color: 'black'}}>{text}</Text>
    </TouchableOpacity>
    )
  };


export default CustomButton;