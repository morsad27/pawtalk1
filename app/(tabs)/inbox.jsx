import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import { useUser } from '@clerk/clerk-expo'
import UserItem from '../../components/Inbox/UserItem'

export default function Inbox() {
  const {user}=useUser();
  const[userList,setUserList]=useState([  ]);
  const[loader,setLoader]=useState(false);

  useEffect(() =>{
    user&&GetUserList();
  },[user])
  //Kukunin yung mga users depende sa kung anong mga users/messages kung meron man.
  const GetUserList =async() =>{
    setLoader(true)
    setUserList([])
    const q=query(collection(db,'Chat'), 
    where('userIds','array-contains',user?.primaryEmailAddress.emailAddress));

    const querySnapshot=await getDocs(q);

    querySnapshot.forEach(doc=>{
     
      setUserList(prevList=>[...prevList,doc.data()]);
    })
    setLoader(false);
  }

  const MapOtherUserList=()=>{
    const list=[];
    userList.forEach((record)=>{
      const otherUser=record.users?.filter(user=>user?.email!=user?.primaryEmailAddress?.emailAddress); 
      const result={
        docId:record.id,
        ...otherUser[0]
      }
      list.push(result)
    })
    return list;
  }
  return (
    <View style={{
      paddingLeft:20,
      marginTop:20, 
    }}>
      <Text style={{
        fontFamily:'SEMI_BOLD',
        fontSize:30,
        marginTop:20
      }}>Inbox</Text>

      <FlatList style={{
        marginTop:20
      }}
      data={MapOtherUserList()}
      refreshing={loader}
      onRefresh={GetUserList}
      renderItem={({item,index})=>(
        <UserItem userInfo={item} key={index}/>
      )}
      />
    </View>
  )
}