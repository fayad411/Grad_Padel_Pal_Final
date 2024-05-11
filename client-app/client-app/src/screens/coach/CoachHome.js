// create a page for coaches to view their profile
//
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Image  , RefreshControl} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyBookings from '../MyBookings';

const CoachProfile = ({ token, onSignOut , refresh}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [role, setRole] = useState('coach');
    const [refreshing, setRefreshing] = useState(false);

    const getCoachData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };
        console.log('Token:', token);
        axios.get('http://192.168.0.104:3000/coach', { headers })
            .then((response) => {
                console.log('Coach:', response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setPhone(response.data.phone);
                setAboutMe(response.data.about_me);
                setImageUrl(response.data.profile_image? response.data.profile_image : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png');
            })
            .catch((error) => {
                console.error('Error fetching coach:', error);
            });

    }

    useEffect(() => {
        getCoachData();
    }, []);
    useEffect(() => {
        getCoachData();
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
                        source={{ uri: imageUrl }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.email}>{email}</Text>
                    <Text style={styles.phone}>{phone}</Text>
                    <Text style={styles.aboutMe}>{aboutMe}</Text>
                </View>
                <MyBookings token={token} role={role} refresh={refresh} />
                <Button title="Sign Out" onPress={onSignOut} />
            </View>
            
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
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        fontSize: 16,
        color: 'blue',
    },
    profileContainer: {
        alignItems: 'center',
        padding: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
    },
    phone: {
        fontSize: 16,
    },
    aboutMe: {
        fontSize: 16,
    },
});

export default CoachProfile;

