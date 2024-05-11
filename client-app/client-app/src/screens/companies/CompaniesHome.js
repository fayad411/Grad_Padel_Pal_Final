import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Image, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationCard from '../../components/LocationCard';
import AddCourt from './AddCourt';
import ViewLocation from './ViewLocation';
import { Ionicons } from '@expo/vector-icons';

const CompaniesHome = ({ token, onSignOut , refresh }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [courtsLocations, setCourtsLocations] = useState([]);
    const [aboutMe, setAboutMe] = useState('');
    const [role, setRole] = useState('company');
    const [addingCourt, setAddingCourt] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [id, setId] = useState('');


    const handleAddCourt = () => {
        setAddingCourt(true);
    };

    const getCompanyData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        axios.get('http://192.168.0.104:3000/company', { headers })
            .then((response) => {
                console.log('Company:', response.data);
                const { name, email, phone, profile_image } = response.data;
                setName(name);
                setEmail(email);
                setPhone(phone);
                setImageUrl(profile_image);
                setId(response.data._id);
            })
            .catch((error) => {
                console.error('Error fetching company:', error);
            });
    }

    const getCompanyCourts = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        axios.get('http://192.168.0.104:3000/company/loacions', { headers })
            .then((response) => {
                console.log('Courts:', response.data);
                setCourtsLocations(response.data);
            })
            .catch((error) => {
                console.error('Error fetching courts:', error);
            });
    }

    useEffect(() => {
        const checkRole = async () => {
            const storedRole = await AsyncStorage.getItem('role');
            setRole(storedRole);
        };

        checkRole();
        getCompanyCourts();
        getCompanyData();
    }, []);

    useEffect(() => {
        const checkRole = async () => {
            const storedRole = await AsyncStorage.getItem('role');
            setRole(storedRole);
        };

        checkRole();
        getCompanyCourts();
        getCompanyData();
    }, [refresh]);

    const updateImage = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };
        const body = { imageUrl };

        axios.put('http://192.168.0.104:3000/company/imageUrl', body, { headers })
            .then((response) => {
                console.log('Image:', response.data);
            })
            .catch((error) => {
                console.error('Error updating image:', error);
            });
    }

    return (
        
        selectedLocation !== '' ? (
            <ViewLocation token={token} onBackToHome={() => setSelectedLocation('')} locationName={selectedLocation} company_id={id} />
        ) : addingCourt ? (
            <AddCourt token={token} onSubmit={() => {
                getCompanyCourts();
                setAddingCourt(false);
            }}
            onClose={() => setAddingCourt(false)}
            />
        ) : (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.profileContainer}>
                    {imageUrl && <Image source={{ uri: imageUrl }} style={styles.profileImage} />}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Update Profile Image URL"
                            value={imageUrl}
                            onChangeText={setImageUrl}
                        />
                        <TouchableOpacity style={styles.updateButton} onPress={updateImage}>
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Email: {email}</Text>
                    <Text style={styles.infoText}>Phone: {phone}</Text>
                </View>

                <View style={styles.courtsContainer}>
                    <Text style={styles.heading}>Courts Locations</Text>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCourt}>
                        <Ionicons name="add" size={24} color="white" />
                        <Text style={styles.addButtonText}>Add Court</Text>
                    </TouchableOpacity>
                    {courtsLocations.map((court, index) => (
                        <TouchableOpacity key={index} onPress={() => setSelectedLocation(court.location)}>
                            <LocationCard key={index} locationName={court.location} numberOfCourts={court.courts} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Button
                    style={styles.signOutButton}
                    title="Sign Out"
                    onPress={onSignOut}
                    color="#841584"
                    accessibilityLabel="Sign out from the application"
                />
            </ScrollView>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        
        marginTop : 50,
        width: '100%',
        alignItems: 'center',

    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: '90%',
        elevation: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: '#4F8EF7',
        borderWidth: 2,
    },
    inputContainer: {
        flex: 1,
        marginLeft: 20,
    },
    input: {
        height: 40,
        borderColor: '#4F8EF7',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    updateButton: {
        backgroundColor: '#4F8EF7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateButtonText: {
        color: 'white',
    },
    name: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 30,
    },
    infoContainer: {
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        marginBottom: 10,
    },
    courtsContainer: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#d3d3d3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: 170,
    },
    addButtonText: {
        color: '#000',
    },
    signOutButton: {
        marginTop: 20,
        maxWidth: 200,
    },
});

export default CompaniesHome;
