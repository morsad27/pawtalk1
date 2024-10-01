import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'

export default function PetSubInfoCard({icon, title,value,pet}) {
  return (
    <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:Colors.WHITE,
        padding:10,
        margin:5,
        borderRadius:8,
        gap:10,
        flex:1 
    }}>
        <Image source={icon}
        style={{
            width:40,
            height:40,
            resizeMode: 'contain'
        }}/>
        <View  style={{
            flex:1,//to avoid overlapping texts/elements in the bg
        }}>
            <Text 
                style={{
                fontFamily: 'REGULAR',
                fontSize:16,
                color:Colors.GRAY
            }}>{title}</Text>
            <Text style={{ fontFamily: 'SEMI_BOLD',
                fontSize:16,
               }}>{value} {}</Text>
        </View>
    </View>
  )
}