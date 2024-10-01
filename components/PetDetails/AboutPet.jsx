import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors';

export default function AboutPet({pet}) {
    const [readMore,setReadMore] =useState(true);
  return (
    <View  style={{
        padding:20,
        }}>
      <Text style={{
        fontFamily:'SEMI_BOLD',
        fontSize:20, 

      }}>About {pet.name}</Text>
      <Text numberOfLines={readMore?3:20} style={{
        fontFamily:'REGULAR',
        fontSize:16,
      }}>{pet.about} </Text>
      {readMore&&
      <Pressable onPress={()=>setReadMore(false)}>
      <Text style={{
        fontFamily:'SEMI_BOLD',
        fontSize:14,
        color:Colors.SECONDARY
      }}>Read More</Text>
      </Pressable>}
    </View>
  )
}