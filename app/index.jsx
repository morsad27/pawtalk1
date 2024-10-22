import { useUser } from "@clerk/clerk-expo";
import { Link, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {

  const { user } = useUser();

  const rootNavigationState=useRootNavigationState()
useEffect(()=>{

  CheckNavLoaded();
},[])

const CheckNavLoaded=()=>{
  if(!rootNavigationState.key)
    return null;
}
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
       
      }}
    >
     
        <Text>
         {user?.fullName}</Text>
         {user?
         <Redirect href={'/(tabs)/home'}/>
         :<Redirect href={'/login'} />}

    </SafeAreaView>
  );
}
