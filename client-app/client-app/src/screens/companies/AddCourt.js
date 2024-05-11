import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddCourt = ({ token, onSubmit , onClose }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('default');
    const [newLocation, setNewLocation] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleAddCourt = async () => {
        console.log('Adding court:', name, 'at location:', selectedLocation || newLocation, 'for price:', price);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };
        console.log(selectedLocation);
        axios.post('http://192.168.0.104:3000/company/new/court', {
            name: name,
            location: selectedLocation === 'default' ? newLocation : selectedLocation,

            price: price
        }, { headers })
            .then((response) => {
                console.log('Court added:', response.data);
                onSubmit();
                
            })
            .catch((error) => {
                console.error('Error adding court:', error);
            });
    }

    useEffect(() => {
        const getLocations = async () => {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            };
            axios.get('http://192.168.0.104:3000/company/Locations/all', { headers })
                .then((response) => {
                    console.log('Locations:', response.data);
                    setLocations(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching locations:', error);
                });
        }

        getLocations();

    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.locationItem}
            onPress={() => {
                setSelectedLocation(item);
                setShowModal(false);
            }}
        >
            <Text>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Court</Text>
            <TextInput
                style={styles.input}
                placeholder='Name'
                value={name}
                onChangeText={setName}
            />
            {newLocation === '' && (   
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowModal(true)}
            >
                <Text>{selectedLocation==='default' ? "Select Location" :selectedLocation }</Text>
            </TouchableOpacity>
            
            )}
           
            {!selectedLocation || selectedLocation=== 'default' && (
                <>


                    <TextInput
                        style={styles.input}
                        placeholder='Or Add New Location'
                        value={newLocation}
                        onChangeText={setNewLocation}
                    />
                </>
            )}

            <TextInput
                style={styles.input}
                placeholder='Price'
                value={price}
                onChangeText={setPrice}
            />
            <View style={{
                paddingBottom: 100,
            }}>
            <TouchableOpacity
                style={styles.button}
                onPress={handleAddCourt}
            >
                <Text style={styles.buttonText}>Add Court</Text>
            </TouchableOpacity>
            <View style={{
                paddingBottom: 20,
            }}>

            </View>
            <TouchableOpacity
                style={{
                    ...styles.button,
                    backgroundColor: 'red',
                
                }}
                onPress={onClose}
            >
                <Text style={{
                    ...styles.buttonText,
                    textAlign: 'center',
                }}>Close</Text>
            </TouchableOpacity>

            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={["default", ...locations]}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: 350,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 18,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    locationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default AddCourt;
