import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import React from 'react';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import PetListByCategory from '../../components/Home/PetListByCategory';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
//import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const data = []; // Empty array as FlatList requires data; not needed here for rendering sections.

  return (
    <View 
      style={{
        padding: 20,
        flex: 1,
        paddingBottom: 0,
        marginTop: 20,
      }}
    >
      <FlatList
        ListHeaderComponent={
          <>
            {/*header*/}
            <Header />
            {/*slider*/}
            <Slider />
          </> //short syntax for react fragment
        }
        data={data} // No actual data; just using FlatList for optimized scroll handling
        renderItem={null} // No items to render in the list itself
        ListFooterComponent={<PetListByCategory />} // Adding PetListByCategory at the bottom
        keyExtractor={(item, index) => index.toString()} // Required for FlatList
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
      />
    </View>
  );
}
