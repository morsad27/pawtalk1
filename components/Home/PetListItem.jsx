import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import MarkFav from '../MarkFav';
import { useAuth } from '../../contexts/AuthContext';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

// Get screen dimensions
const { width } = Dimensions.get('window');

export default function PetListItem({ pet }) {
  const router = useRouter();
  const { user } = useAuth();

  const InitiateChat = async () => {
    const docId1=user?.primaryEmailAddress?.emailAddress+'_'+pet.email;
    const docId2=pet.email+'_'+user?.primaryEmailAddress?.emailAddress;
  
    const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
    const querySnapshot = await getDocs(q);
  
    // Check if chat already exists
    if (!querySnapshot.empty) {
      // Navigate to the first existing chat document
      const existingChatDoc = querySnapshot.docs[0]; // Access the first document if exists
      console.log(existingChatDoc.data()); // Log document data for debugging
      router.push({
        pathname: '/chat',
        params: { id: existingChatDoc.id }, // Use existing document ID
      });
      return; // Exit if chat exists
    }
  
    // If no existing chat, create a new one
    await setDoc(doc(db, 'Chat', docId1), {
      id: docId1,
      users: [
        {
          email: user?.primaryEmailAddress?.emailAddress, // Keep email for functionality
          imageUrl: user?.imageUrl,
          name: user?.name, // Use user's name
        },
        {
          email: pet?.email,
          imageUrl: pet?.userImage,
          name: pet?.username, // Use pet's username
        },
      ],
      userIds: [user?.primaryEmailAddress?.emailAddress, pet?.email], // Retain user IDs for chat functionality
    });
  
    // Navigate to the newly created chat
    router.push({
      pathname: '/chat',
      params: { id: docId1 },
    });
  };
  

  return (
    <View style={styles.container}>
      {/* Pet Image */}
      <Image
        source={pet?.imageUrl ? { uri: pet.imageUrl } : require('../../assets/images/placeholder.png')}
        style={styles.image}
        resizeMode="cover"
        onError={(e) => console.log('Error loading image', e)}
      />

      {/* Favorite Icon */}
      <TouchableOpacity style={styles.favIcon} onPress={() => console.log('Favorite Pressed')}>
        <MarkFav pet={pet} color={Colors.GRAY} name={'heart'} />
      </TouchableOpacity>

      {/* Content Below Image */}
      <View style={styles.textContainer}>
        {/* Name and Age */}
        <View style={styles.nameAgeContainer}>
          <Text style={styles.nameText} numberOfLines={1}>{pet?.name}</Text>
          <Text style={styles.ageText}>{pet?.age}</Text>
        </View>

        {/* Pet Details */}
        <Text style={styles.breedText}>{`Breed: ${pet?.breed}`}</Text>
        <Text style={styles.infoText}>{`Gender: ${pet?.sex}`}</Text>
        <Text style={styles.addressText}>{`Location: ${pet?.address}`}</Text>

        {/* Pet Description */}
        {pet?.about && (
          <Text numberOfLines={3} style={styles.descriptionText}>{pet?.about}</Text>
        )}

        {/* Owner Email */}
        <Text style={styles.emailText}>{`Contact Owner: ${pet?.username}`}</Text>

        {/* Adopt Button */}
        <TouchableOpacity onPress={InitiateChat} style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>Adopt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SECONDARY, // Blue background
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Android shadow
    width: width * 0.9,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: width * 0.5, // Responsive image height
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_GRAY, // Placeholder color
  },
  favIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: Colors.LIGHT_PRIMARY, // Orange for the heart icon background
    padding: 8,
    borderRadius: 20,
    shadowColor: Colors.BLACK, // Add shadow to the heart icon
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  textContainer: {
    marginTop: 15,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'medium',
    fontSize: width * 0.05, // Responsive font size
    color: Colors.BLACK,
  },
  ageText: {
    backgroundColor: Colors.WHITE, // Light yellow for age background
    color: Colors.PRIMARY, // Orange for age text
    fontFamily: 'regular',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: width * 0.04, // Responsive font size
  },
  breedText: {
    color: Colors.BLACK,
    fontFamily: 'regular',
    fontSize: width * 0.045,
    marginTop: 5,
  },
  infoText: {
    color: Colors.BLACK,
    fontFamily: 'regular',
    fontSize: width * 0.045,
    marginTop: 5,
  },
  addressText: {
    color: Colors.BLACK,
    fontFamily: 'regular',
    fontSize: width * 0.045,
    marginTop: 5,
  },
  descriptionText: {
    color: Colors.BLACK,
    fontFamily: 'regular',
    fontSize: width * 0.04,
    marginTop: 5,
  },
  emailText: {
    color: Colors.WHITE,
    fontFamily: 'regular',
    fontSize: width * 0.035,
    marginTop: 10,
  },
  adoptButton: {
    marginTop: 15,
    backgroundColor: Colors.PRIMARY, // Orange for the button
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: Colors.BLACK, // Shadow on the button
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  adoptButtonText: {
    fontFamily: 'medium',
    fontSize: width * 0.045,
    color: Colors.WHITE,
  },
});
