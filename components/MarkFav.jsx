import { View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import Shared from '../Shared/Shared';

export default function MarkFav({ pet , color='black', name='heart-outline'}) {
    const { user } = useUser();
    const [favList, setFavList] = useState([]);
    const [loading, setLoading] = useState(false);  // Add loading state to avoid multiple requests

    useEffect(() => {
        if (user) {
            GetFav();
        }
    }, [user]);

    const GetFav = async () => {
        setLoading(true);
        try {
            const result = await Shared.GetFavList(user);
            console.log('Fetched Favorites:', result);
            setFavList(result?.favorites ? result.favorites : []);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const AddToFav = async () => {
        if (loading) return;  // Prevent multiple taps
        setLoading(true);
        try {
            const updatedFavList = [...new Set([...favList, pet?.id])];  // Ensure unique pet IDs
            await Shared.UpdateFav(user, updatedFavList);
            GetFav();  // Refresh the favorite list after updating
        } catch (error) {
            console.error('Error adding to favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromFav = async () => {
        if (loading) return;  // Prevent multiple taps
        setLoading(true);
        try {
            const updatedFavList = favList.filter(item => item !== pet.id);
            await Shared.UpdateFav(user, updatedFavList);
            GetFav();  // Refresh the favorite list after updating
        } catch (error) {
            console.error('Error removing from favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            {favList?.includes(pet.id) ? ( 
                <Pressable onPress={removeFromFav} disabled={loading}>
                    <Ionicons name="heart" size={45} color='red' />
                </Pressable>
            ) : (
                <Pressable onPress={AddToFav} disabled={loading} style={{
                
                }}>
                    <Ionicons name={name} size={45} color={color} border={5} />
                </Pressable>
            )}
        </View>
    );
}
