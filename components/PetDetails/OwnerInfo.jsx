import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'; 

export default function OwnerInfo({pet}) {
  return (
    <View style={styles.container}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
        }}>
      <Image source={{uri:pet.userImage}}
      style={{ 
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'gray',
        resizeMode: 'cover'  // Resizes the image to maintain aspect ratio, crops if necessary.
      }}/>
      <View>
        <Text style={{
            fontFamily: 'SEMI_BOLD',
            fontSize: 17
        }}>{pet.username}</Text>
        <Text style={{
            fontFamily: 'REGULAR',
            color: 'gray',
        }}>Pet Owner</Text>
      </View>
      </View>
      <Ionicons name="chatbox-ellipses" size={24} color={Colors.SECONDARY} />
      
    </View>
    
    
  )
}

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap:10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.SECONDARY,
        padding:10,
        backgroundColor:Colors.WHITE,
        justifyContent: 'space-between',
    }
})