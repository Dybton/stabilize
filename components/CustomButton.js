import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CustomButton = ({data, handleClick, text, timeframe, setTimeframe}) => {
    return (
        <TouchableOpacity 
            onPress={() => {
                handleClick(data);
                setTimeframe(text);
            }} 

            style={{
                borderRadius: 50,
                backgroundColor: (timeframe === text) ? 'rgba(238, 238, 238, 1)' : 'white',
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