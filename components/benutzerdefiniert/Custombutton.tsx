import { TouchableOpacity, Text, View } from 'react-native'
import React from 'react'


const Custombutton = ({title,containerStyles,isLoading, textStyles}) => {
  return (
    <TouchableOpacity
    activeOpacity={0.7}
    className={`bg-red-400 rounded-lg justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""}` }
    disabled = {isLoading}
    >
      
      <Text className={`font-semibold ${textStyles}`}>{title}</Text>

    </TouchableOpacity>
  )
}

export default Custombutton
