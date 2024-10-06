import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { addDoc, collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore'; // Add 'query' and 'orderBy'
import { useUser } from '@clerk/clerk-expo';
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); // Destructure params for clarity
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      GetUserDetails(); // Ensure this only runs when 'id' is available

      // Query the messages and order by 'createdAt' to ensure correct ordering
      const q = query(collection(db, 'Chat', id, 'Messages'), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageData = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Safely handle cases where createdAt is missing or undefined
          return {
            _id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Date 
              ? data.createdAt // Already a Date object
              : data.createdAt?.toDate // Firestore Timestamp, convert to Date
                ? data.createdAt.toDate() 
                : new Date(), // Fallback to current date if missing
          };
        });

        setMessages(messageData);
      });

      return () => unsubscribe();
    }
  }, [id]);

  const GetUserDetails = async () => {
    try {
      const docRef = doc(db, 'Chat', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();
        const otherUser = result?.users.filter(
          (item) => item.email !== user?.primaryEmailAddress?.emailAddress
        );
        if (otherUser && otherUser[0]) {
          navigation.setOptions({
            headerTitle: otherUser[0].name || 'Chat',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const onSend = async (newMessages = []) => {
    try {
      const messageToSend = {
        ...newMessages[0],
        createdAt: new Date(), // Ensure every message has a Date object for createdAt
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [messageToSend])
      );

      await addDoc(collection(db, 'Chat', id, 'Messages'), messageToSend);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress, 
        name: user?.fullName,
        avatar: user?.imageUrl,
      }}
    />
  );
}
