import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Shared from '../../Shared/Shared';
import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import PetListItem from '../../components/Home/PetListItem';

export default function Favorite() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetFavPetIds();
    }
  }, [user]);

  // Fetch Favorite Pet IDs
  const GetFavPetIds = async () => {
    setLoader(true);
    const result = await Shared.GetFavList(user);
    console.log("Favorite IDs:", result?.favorites); // Log favorites

    if (result?.favorites) {
      setFavIds(result.favorites);
      GetFavPetList(result.favorites);
    } else {
      setFavIds([]); // Set to empty array if no favorites found
      setFavPetList([]); // Clear pet list if no favorites
    }
    setLoader(false);
  };

  // Fetch related pet list
  const GetFavPetList = async (favIds) => {
    if (!favIds || favIds.length === 0) {
      setFavPetList([]); // Clear list if no IDs
      return;
    }

    console.log("Fetching Pets with IDs:", favIds); // Log IDs being fetched
    setLoader(true);
    const q = query(collection(db, 'Pets'), where('id', 'in', favIds));
    const querySnapshot = await getDocs(q);
    
    const pets = [];
    querySnapshot.forEach((doc) => {
      pets.push(doc.data());
    });

    console.log("Fetched Pets Count:", pets.length); // Log count of fetched pets
    setFavPetList(pets);
    setLoader(false);
  };

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text style={{ fontFamily: 'SEMI_BOLD', fontSize: 30 }}>Favorite</Text>
      {loader ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={favPetList}
          keyExtractor={(item) => item.id} // Ensure unique keys for items
          onRefresh={GetFavPetIds}
          refreshing={loader}
          renderItem={({ item }) => (
            <PetListItem pet={item} />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No favorites found.
            </Text>
          }
        />
      )}
    </View>
  );
}

