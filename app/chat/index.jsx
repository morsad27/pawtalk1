import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { addDoc, collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
import { useAuth } from '../../contexts/AuthContext';

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); // Destructure params for clarity
  const navigation = useNavigation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      GetUserDetails(); // Ensure this only runs when 'id' is available

      // Query the messages and order by 'createdAt' to ensure correct ordering
      const q = query(collection(db, 'Chat', id, 'Messages'), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(), // Firestore Timestamp to Date
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
        const otherUser = result?.users.find((item) => item.name !== user?.name); // Use find for single user

        if (otherUser) {
          navigation.setOptions({
            headerTitle: otherUser.name || 'Chat',
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
        _id: user?.name,  // Use user.name as the user ID
        name: user?.fullName,
        avatar: user?.imageUrl,
      }}
    />
  );
}
