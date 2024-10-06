import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import Colors from '../../constants/Colors';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import PetListItem from './../../components/Home/PetListItem';

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'User Post',
      headerStyle: {
        backgroundColor: Colors.SECONDARY,
      },
      headerTintColor: '#fff',
    });
    if (user) {
      GetUserPost();
    }
  }, [user]);

  /**
   * Fetch the user post list
   */
  const GetUserPost = async () => {
    try {
      setLoader(true);
      const q = query(collection(db, 'Pets'), where('email', '==', user?.primaryEmailAddress?.emailAddress));
      const querySnapshot = await getDocs(q);

      const posts = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setUserPostList(posts);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setLoader(false);
    }
  };

  /**
   * Delete a user post
   * @param {string} docId 
   */
  const deletePost = async (docId) => {
    try {
      await deleteDoc(doc(db, 'Pets', docId));
      Alert.alert('Success', 'Post deleted successfully');
      GetUserPost(); // Refresh the list
    } catch (error) {
      console.error("Error deleting post: ", error);
      Alert.alert('Error', 'Failed to delete the post');
    }
  };

  /**
   * Confirm delete action
   * @param {string} docId 
   */
  const OnDeletePost = (docId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deletePost(docId), style: 'destructive' },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>User Posts</Text>

      {loader && <ActivityIndicator size="large" color={Colors.PRIMARY} />}

      <FlatList
        data={userPostList}
        keyExtractor={(item) => item.id}
        numColumns={1}
        refreshing={loader}
        onRefresh={GetUserPost}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <PetListItem pet={item} />
            <Pressable onPress={() => OnDeletePost(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      {!loader && userPostList?.length === 0 && <Text style={styles.noPostsText}>No posts found.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontFamily: 'SEMI_BOLD',
    fontSize: 24,
    color: '#333',
    marginBottom: 15,
  },
  postContainer: {
    marginBottom: 15,
    backgroundColor:Colors.SECONDARY,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    fontFamily: 'REGULAR',
    textAlign: 'center',
    color: '#fff',
  },
  noPostsText: {
    textAlign: 'center',
    fontFamily: 'REGULAR',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
