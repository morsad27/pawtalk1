import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import Colors from './../../constants/Colors';

export default function Category({ category }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Cats');

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, 'Category'));
    const categories = [];
    snapshot.forEach((doc) => {
      categories.push(doc.data());
    });
    setCategoryList(categories); // Load categories into state
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontFamily: 'REGULAR', fontSize: 20 }}>Category</Text>

      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item.name); // Set local selected category
              category(item.name); // Call the passed function to update the pet list
            }}
            style={{ flex: 1 }}
          >
            <View
              style={[
                styles.container,
                selectedCategory == item.name && styles.selectedCategoryContainer,
              ]}
            >
              <Image
                source={{ uri: item?.imageUrl }}
                style={{ width: 40, height: 40 }}
              />
            </View>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'LIGHT',
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    margin: 5,
  },
  selectedCategoryContainer: {
    backgroundColor: Colors.SECONDARY,
    borderColor: Colors.SECONDARY,
    borderWidth: 2,
  },
});
