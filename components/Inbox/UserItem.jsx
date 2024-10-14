import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from './../../constants/Colors';
import { Link } from 'expo-router';

export default function UserItem({ userInfo }) {
  return (
    <>
      <Link href={'/chat?id=' + userInfo.docId}>
        <View
          style={{
            marginVertical: 7,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <Image
            source={{ uri: userInfo?.imageUrl }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25, // Rounder shape
            }}
          />
          <Text
            style={{
              fontFamily: 'SEMI_BOLD',
              fontSize: 18, // Slightly smaller font size
              marginLeft: 15, // More balanced spacing between image and text
            }}
          >
            {userInfo?.name}
          </Text>
        </View>
      </Link>

      <View
        style={{
          borderBottomWidth: 0.5, // Better visibility for the divider
          marginHorizontal: 10,
          borderColor: Colors.GRAY,
        }}
      />
    </>
  );
}
