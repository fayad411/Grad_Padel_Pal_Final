// create a page for a normal user to view their profile

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyBookings from './MyBookings';

const UserHome = ({ token, onSignOut , refresh }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('user');

    const getUserData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };
        console.log('Token:', token);
        axios.get('http://192.168.0.104:3000/user', { headers })
            .then((response) => {
                console.log('User:', response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setPhone(response.data.phone);
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });

    }

    useEffect(() => {
        getUserData();
    }, []);
    useEffect(() => {
        getUserData();
    }, [refresh]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Text style={styles.appName}>Padel Pal</Text>
                    <Text style={styles.backButton}></Text>
                </View>
                <View style={styles.profileContainer}>
                    <Image
                        source={{ uri: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.email}>{email}</Text>
                    <Text style={styles.phone}>{phone}</Text>
                </View>
                <Button title="Sign Out" onPress={onSignOut} />
            </View>

            <MyBookings token={token} role={role} refresh={refresh}/>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
    },
    phone: {
        fontSize: 16,
    },
});

export default UserHome;