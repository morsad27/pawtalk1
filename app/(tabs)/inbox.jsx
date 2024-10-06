import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import UserItem from '../../components/Inbox/UserItem';

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetUserList(); // Fetch user list when the user is available
    }
  }, [user]);

  // Fetch user list based on the chats that include the logged-in user
  const GetUserList = async () => {
    setLoader(true);
    try {
      const q = query(
        collection(db, 'Chat'),
        where('userIds', 'array-contains', user?.primaryEmailAddress.emailAddress)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedUsers = [];
      
      querySnapshot.forEach(doc => {
        fetchedUsers.push({ ...doc.data(), id: doc.id }); // Include document ID in data
      });

      setUserList(fetchedUsers); // Set the fetched users to state
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
    setLoader(false);
  };

  // Map user list to display only the other user in the conversation
  const MapOtherUserList = () => {
    const list = [];
    userList.forEach((record) => {
      const otherUser = record.users?.filter(u => u?.email !== user?.primaryEmailAddress?.emailAddress);
      if (otherUser && otherUser[0]) {
        list.push({
          docId: record.id, // Set document ID for chat
          ...otherUser[0],  // Include other user's data
        });
      }
    });
    return list;
  };

  return (
    <View style={{ paddingLeft: 20, marginTop: 20 }}>
      <Text style={{
        fontFamily: 'SEMI_BOLD',
        fontSize: 30,
        marginTop: 20,
      }}>Inbox</Text>

      <FlatList
        style={{ marginTop: 20 }}
        data={MapOtherUserList()}
        refreshing={loader}
        onRefresh={GetUserList}
        keyExtractor={(item) => item.docId} // Use unique key for each item
        renderItem={({ item }) => (
          <UserItem userInfo={item} />
        )}
      />
    </View>
  );
}
