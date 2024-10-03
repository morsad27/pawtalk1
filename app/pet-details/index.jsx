import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function PetDetails() {
    const pet=useLocalSearchParams();
    const navigation = useNavigation();
    const router=useRouter();
    const {user}=useUser();
    useEffect(()=>{
        navigation.setOptions({
            headerTransparent: true,
            headerTitle:''

        })
    }, [])
    /**
     * use to initiate sa chat between sa users.
     */
    const InitiateChat=async()=>{
        const docId1=user?.primaryEmailAddress?.emailAddress+'_'+pet.email;
        const docId2=pet.email+'_'+user?.primaryEmailAddress?.emailAddress;

        const q=query(collection(db,'Chat'), where('id','in',[docId1,docId2]));
        const querySnapshot=await getDocs(q);
        querySnapshot.forEach(doc=>{
          console.log(doc.data());
         router.push({
         pathname:'/chat',
        params:{id:doc.id}
        })
        })

        if(querySnapshot.docs?.length==0){
          await setDoc(doc(db, 'Chat',docId1),{
            id:docId1,
            users:[
              {
                email:user?.primaryEmailAddress?.emailAddress,
                imageUrl:user?.imageUrl,
                name:user?.fullName
              },
              {
                email:pet?.email,
                imageUrl:pet?.userImage,
                name:pet?.username
              }
            ],
            userIds:[user?.primaryEmailAddress?.emailAddress,pet?.email]
          });
          router.push({
          pathname:'/chat',
          params:{id:docId1}
          })
        }

    }
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
            <TouchableOpacity
            onPress={InitiateChat} 
            style={styles.adoptbutton}>
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