    import { View, Text } from 'react-native'
    import React from 'react'
    import { Tabs } from 'expo-router'
    import Ionicons from '@expo/vector-icons/Ionicons';
    import Fontisto from '@expo/vector-icons/Fontisto';
    import Colors from './../../constants/Colors'

    export default function TabLayout() {
    return (
        <Tabs
        screenOptions={{
            tabBarActiveTintColor:Colors.PRIMARY
        }}
        >
            <Tabs.Screen name='home'//adopt page na to
            options={{
                title: 'Adopt',
                headerShown: false,
                tabBarIcon:({color})=><Ionicons name="paw" size={30} color={color} />
            }}/>
            <Tabs.Screen name='favorite'options={{
                title: 'Favorite',
                headerShown: false,
                tabBarIcon:({color})=><Ionicons name="heart" size={30} color={color} />
            }}/>
            <Tabs.Screen style={{
                headerShown: false,
                bordersize: 10,
                borderColor: Colors.BLACK,
            }} name='add'options={{//eto na yung home
                title: 'Home',
                tabBarIcon:({color})=><Ionicons name="home" size={35} color={Colors.SECONDARY}/>
            }}/>
            <Tabs.Screen name='inbox'options={{
                title: 'Inbox',
                headerShown: false,
                tabBarIcon:({color})=><Ionicons name="chatbox-ellipses" size={30} color={color} />
            }}/>
            <Tabs.Screen name='profile'options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon:({color})=><Ionicons name="person" size={30} color={color} />
            }}/>
        </Tabs>
    )
    }