import { View, Text, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Picker} from '@react-native-picker/picker'
import { useNavigation, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import Category from '../../components/Home/Category';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddNewPet() {
    const navigation=useNavigation();
    const [formData,setFormData] = useState(
      {category:'Cats',sex:'Male'}
    );
    const [gender,setGender]=useState();
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [image,setImage] = useState();
    const [loader,setLoader] = useState();
    const {user}=useUser();
    const router=useRouter();
    useEffect(()=>{
        navigation.setOptions({
            headerTitle: 'Add New Pet'
        }) 
        GetCategories(); // Fetch categories when component mounts
    },[])

    const GetCategories = async () => {
      const snapshot = await getDocs(collection(db, 'Category'));
      const categories = [];
      snapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setCategoryList(categories); // Load categories into state
    };

    /**
     * use to pick image from gallary
     */
    const imagePicker=async()=>{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }

    const handleInputChange=(fieldName,fieldValue)=>{
       setFormData(prev=>({
        ...prev,
        [fieldName]: fieldValue
       }))
    }

    const onSubmit = () => {
      if (Object.values(formData).some(value => !value) || !image) {
          ToastAndroid.show('Enter All Details', ToastAndroid.SHORT);
          return;
      }
      UploadImage();
  };
  
  /**
   * used to upload pet image to firebase storage (server)
   */
  const UploadImage = async () => {
      setLoader(true);
      try {
          const resp = await fetch(image);
          const blobImage = await resp.blob();
          const storageRef = ref(storage, 'PetAdopt/' + Date.now() + '.jpg');
  
          const snapshot = await uploadBytes(storageRef, blobImage);
          console.log('File Uploaded');
          
          const downloadUrl = await getDownloadURL(snapshot.ref);
          console.log('Image URL:', downloadUrl);
  
          SaveFormData(downloadUrl); // Call SaveFormData after getting the download URL
      } catch (error) {
          console.error('Error uploading image:', error);
          ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
      } finally {
          setLoader(false);
      }
  };
  
  const SaveFormData = async (imageUrl) => {
      const docId = Date.now().toString();
      try {
          await setDoc(doc(db, 'Pets', docId), {
              ...formData,
              imageUrl: imageUrl,
              username: user?.fullName,
              email: user?.primaryEmailAddress?.emailAddress,
              userImage: user?.imageUrl,
              id: docId
          });
          ToastAndroid.show('Pet added successfully', ToastAndroid.SHORT);
          router.replace('/(tabs)/home');
      } catch (error) {
          console.error('Error saving form data:', error);
          ToastAndroid.show('Error saving pet data', ToastAndroid.SHORT);
      }
  };
  
    
  return (
    <ScrollView style={{
        padding:20
    }}>
      <Text style={{
        fontFamily: 'SEMI_BOLD',
        fontSize: 20,
      }}>Add New Pet for Adoption!</Text>


     <Pressable onPress={imagePicker}>
       {!image? <Image source={require('./../../assets/images/placeholder.png')}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15,
          borderWidth: 1,
          borderColor:Colors.GRAY
        }}/>:
        <Image source={{uri:image}}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15
        }}/>}
      </Pressable>

      <View style={style.inputContainer}>
        <Text style={style.label}>Pet Name *</Text>
        <TextInput style={style.input} 
        onChangeText={(value)=>handleInputChange('name',value)}/>
      </View>

      <View style={style.inputContainer}>
      <Text style={style.label}>Pet Category *</Text>
      <Picker
        selectedValue={selectedCategory}
        style={style.input}
        onValueChange={(itemValue, itemIndex) =>{
            setSelectedCategory(itemValue);
            handleInputChange('category',itemValue);
          }}>
            {categoryList.map((category,index)=>(
              <Picker.Item key={index}label={category.name} value={category.name} />
            ))}
      
      </Picker>
      </View>


      <View style={style.inputContainer}>
        <Text style={style.label}>Breed *</Text>
        <TextInput style={style.input} 
        onChangeText={(value)=>handleInputChange('breed',value)}/>
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Age *</Text>
        <TextInput style={style.input} 
        onChangeText={(value)=>handleInputChange('age',value)}/>
      </View>

      <View style={style.inputContainer}>
      <Text style={style.label}>Gender *</Text>
      <Picker
        selectedValue={gender}
        style={style.input}
        onValueChange={(itemValue, itemIndex) =>{
            setGender(itemValue);
            handleInputChange('sex',itemValue);
          }}>
      <Picker.Item label="Male" value="Male" />
      <Picker.Item label="Female" value="Female" />
      </Picker>
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Weight *</Text>
        <TextInput style={style.input} 
        onChangeText={(value)=>handleInputChange('weight',value)}/>
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Address *</Text>
        <TextInput style={style.input} 
        onChangeText={(value)=>handleInputChange('address',value)}/>
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>About *</Text>
        <TextInput style={style.input} 
        numberOfLines={5}
        multiline={true}
        onChangeText={(value)=>handleInputChange('about',value)}/>
      </View>

      <TouchableOpacity 
      style={style.button}
      disabled={loader} 
      onPress={onSubmit}>
        {loader?<ActivityIndicator size ={'large'}/>:
        <Text style={{fontFamily:'SEMI_BOLD'}}>Submit</Text> }
        
      </TouchableOpacity>


    </ScrollView>
  )
}

const style = StyleSheet.create({ 
    inputContainer: {
        marginVertical:5
    },
    input:{
        padding:15,
        backgroundColor:Colors.WHITE,
        borderRadius:5,
        fontFamily: 'REGULAR',
    },
    label:{
        marginVertical:5,
        fontFamily: 'REGULAR',
    },
    button:{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        marginVertical:10,
        fontFamily: 'SEMI_BOLD',
        alignItems:'center',
        marginBottom: 50,
        borderRadius: 20,
    }
})