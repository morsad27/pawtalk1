import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';

export default function PetDetails() {
    const pet=useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(()=>{
        navigation.setOptions({
            headerTransparent: true,
            headerTitle:''

        })
    }, [])
  return (
    <View>
      <ScrollView 
      showsVerticalScrollIndicator={false}
      >
        {/* pet info */}
        <PetInfo pet={pet}/>
        {/* pet SubInfo */}
        <PetSubInfo pet={pet}/>
        {/**about */}
        <AboutPet pet={pet}/>
        {/** owner details */}
        <OwnerInfo pet={pet}/>
        <View style={{
          height:70 //height from petinfo to adoptme button
        }}>

        </View>
        </ScrollView>
        {/** adopt me button */}
        <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.adoptbutton}>
               <Text style={{
                 textAlign: 'center',
                 fontFamily: 'SEMI_BOLD',
                 fontSize:20, 
          }}>Adopt Me</Text>
            </TouchableOpacity>
        </View>
      
    </View>
  )
}
const styles = StyleSheet.create({
  adoptbutton:{
    padding:15,
    backgroundColor:Colors.SECONDARY,
    borderRadius:10,
    alignSelf:'bottom',
  },
  bottomContainer:{
    position:'absolute',
    width:'100%',
    bottom:0,
  }
})