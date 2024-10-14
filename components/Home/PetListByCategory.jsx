import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Category from '../../components/Home/Category';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import PetListItem from './PetListItem';

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]); // Pet list state
  const [loader, setLoader] = useState(false); // Loader state

  useEffect(() => {
    GetPetList('Cats'); // Default category on component load
  }, []);

  /**
   * Fetches pet list based on category selection.
   * @param {string} category
   */
  
  const GetPetList = async (category) => {
    setLoader(true); // Show loader while fetching data
    setPetList([]); // Clear pet list before updating

    const q = query(collection(db, 'Pets'), where('category', '==', category));
    const querySnapshot = await getDocs(q);

    const pets = [];
    querySnapshot.forEach((doc) => {
      pets.push(doc.data());
    });

    setPetList(pets); // Update pet list
    setLoader(false); // Hide loader
  };

  return (
    <View>
      {/* Pass category change callback to Category component */}
      <Category category={(value) => GetPetList(value)} />

      <FlatList
        data={petList}
        style={{ marginTop: 10 }}
        refreshing={loader} // Display loader when refreshing
        onRefresh={() => GetPetList('Cats')} // Handle pull-to-refresh
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        renderItem={({ item }) => 
        
        <PetListItem pet={item} />} // Render each pet item
      />
    </View>
  );
}
