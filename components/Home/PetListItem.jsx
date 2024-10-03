import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router'
import MarkFav from '../MarkFav';
export default function PetListItem({ pet }) {
  const router=useRouter();
  return (
    <TouchableOpacity  
    onPress={()=> router.push({
      pathname: '/pet-details',
      params:pet
    })} 
    style={styles.container}>
      <Image
        source={{ uri: pet?.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={{
        position:'absolute',
        zIndex:10,
        left:10,
        bottom:10
      }}>
        <MarkFav pet={pet} color={'white'} name={'heart'} />
      </View>
      <View style={styles.textContainer}>
        {/* Name and Age on the same row */}
        <View style={styles.nameAgeContainer}>
          <Text style={styles.nameText}>{pet?.name}</Text>
          <Text style={styles.ageText}>{pet?.age}</Text>
        </View>

        {/* Breed and description below the name */}
        <Text style={styles.breedText}>{"Gender: "+pet?.sex}</Text>
        {pet?.about && (
          <Text numberOfLines={6} style={styles.descriptionText}>{pet?.about}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 10,
    flexDirection: 'row', // Aligns image and text horizontally
    alignItems: 'center', // Vertically centers content
  },
  image: {
    width: 150,
    height: 165,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1, // Take remaining space
    marginLeft: 10, // Space between image and text
  },
  nameAgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align name and age at opposite ends
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'SEMI_BOLD',
    fontSize: 16,
    color: Colors.BLACK,
  },
  ageText: {
    color: Colors.PRIMARY,
    fontFamily: 'REGULAR',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  breedText: {
    color: Colors.BLACK,
    fontFamily: 'REGULAR',
    fontSize: 14,
    marginTop: 5, // Space between name and breed
  },
  descriptionText: {
    color: Colors.BLACK,
    fontFamily: 'REGULAR',
    fontSize: 14,
    marginTop: 5, // Space between breed and description
  },
});
