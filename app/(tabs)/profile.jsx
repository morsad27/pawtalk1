import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import {useAuth, useUser} from '@clerk/clerk-expo';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function Profile() {
  const Menu=[
    {
      id: 1,
      name:'Add new Pet',
      icon:'paw',
      path:'/add-new-pet'
    },
    {
      id: 2,
      name:'Logout',
      icon:'exit',
      path:'logout'
    }
    
    
  ]
  const {user}=useUser();
  const router=useRouter();
  const {signOut}=useAuth();
  const onPressMenu=(menu)=>{
    if(menu=='logout')
    {
      signOut();
      return ;
    }

    router.push(menu.path)
  }
  return (
    <View style={{
      padding:20,
      marginTop:20,
    }}>
      <Text style={{
        fontFamily: 'SEMI_BOLD',
        fontSize:30,

      }}>Profile</Text>

      <View style={{
        display: 'flex', 
        alignItems: 'center',
        marginVertical:25,
      }}>
        <Image source={{uri:user.imageUrl}} style={{
          width:80,
          height:80,
          borderRadius:99,
          gap:7 
        }}/>
        <Text style={{
          fontFamily: 'SEMI_BOLD',
          fontSize:20,
          marginTop:6,
        }}>{user.fullName}</Text>
        <Text style={{
          fontFamily: 'REGULAR',
          fontSize:16,
          color: 'gray',

        }}>{user.primaryEmailAddress.emailAddress}</Text>
      </View>

      <FlatList 
      data={Menu}
      renderItem={({item,index})=>(
        <TouchableOpacity 
        onPress={()=>onPressMenu(item)}
        key={index}
        style={{
          marginVertical:10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap:10,
          backgroundColor:Colors.WHITE,
          padding:10,
          borderRadius:10
        }}>
          <Ionicons name={item.icon} size={35} color={Colors.SECONDARY} 
           style={{
            padding:10,
            backgroundColor:Colors.LIGHT_PRIMARY,
            borderRadius:10,
           }}/>
           <Text style={{
            fontFamily: 'REGULAR',
            fontSize:20,
           }}>{item.name}</Text>
          </TouchableOpacity>
      )} />
    </View>
  )
}