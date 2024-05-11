import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewLocation = ({ token, onBackToHome, locationName, company_id }) => {
    const [courts, setCourts] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const fetchData = async () => {
        try {
            const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };
            const body = {
                location: locationName,
                _id: company_id
            };
            const response = await axios.post('http://192.168.0.104:3000/company/courts/location/all', body, { headers });

            const courts = response.data.map((court) => ({
                _id: court.court._id,
                name: court.court.name,
                price: court.court.price,
                reservations: court.reservations,
            }));
            setCourts(courts);
            console.log('Courts:', courts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteCourt = async (courtId) => {
        try {
            const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };
            const body = {
                _id: courtId,
            };
            const response = await axios.post('http://192.168.0.104:3000/company/court', body, { headers });
            console.log('Court deleted:', response.data);
            fetchData();
            setNotification('Court deleted successfully');
            setTimeout(() => {
                setNotification(null);
            }, 2000); 
        } catch (error) {
            console.error('Error deleting court:', error);
            setNotification('Error deleting court');
            setTimeout(() => {
                setNotification(null);
            }, 2000); 
        }
    };

    const handleNameChange = (newValue, index) => {
        const updatedCourts = [...courts];
        updatedCourts[index].name = newValue;
        setCourts(updatedCourts);
    };

    const handlePriceChange = (newValue, index) => {
        const updatedCourts = [...courts];
        updatedCourts[index].price = newValue;
        setCourts(updatedCourts);
    };

    const handleSaveChanges = async () => {
        try {
            const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };
            console.log('Courts:', courts);
            const updatedCourts = courts.map((court) => ({
                _id: court._id,
                name: court.name,
                price: Number(court.price),
            }));
            await axios.put('http://192.168.0.104:3000/company/update/many/courts', { updatedCourts }, { headers });
            console.log('Changes saved successfully');
            setNotification('Changes saved successfully');
            setTimeout(() => {
                setNotification(null);
            }, 2000); 
        } catch (error) {
            console.error('Error saving changes:', error);
            setNotification('Error saving changes');
            setTimeout(() => {
                setNotification(null);
            }, 2000); 
        }
    };

    return (
        isLoading ? <Text style={styles.loadingText}>Loading...</Text> :
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>{locationName} Courts</Text>
                {notification && <Text style={styles.notification}>{notification}</Text>}
                <View style={styles.courtsContainer}>
                    {courts.map((court, index) => (
                        <View key={court._id} style={styles.courtCard}>
                            <TextInput
                                style={styles.input}
                                value={court.name}
                                onChangeText={(newValue) => handleNameChange(newValue, index)}
                                placeholder="Court Name"
                            />
                            <TextInput
                                style={styles.input}
                                value={court.price.toString()}
                                onChangeText={(newValue) => handlePriceChange(newValue, index)}
                                placeholder="Price"
                                keyboardType="numeric"
                            />
                            <Button title="Delete" onPress={() => handleDeleteCourt(court._id)} />
                            <Icon name="trash" size={20} color="#900" />
                        </View>
                    ))}
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Save Changes" onPress={handleSaveChanges} />
                    <Button title="Back" onPress={onBackToHome} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    courtsContainer: {
        width: '100%',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginTop: 100,
    },
    scrollView: {
        backgroundColor: '#fff',
    },
    courtCard: {
        backgroundColor: '#fff',
        elevation: 2,
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
    },
  
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    notification: {
        fontSize: 18,
        marginBottom: 10,
        color: 'green',
    },
});

export default ViewLocation;
