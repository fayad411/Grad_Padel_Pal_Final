import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';

export default function CoachesSessions({ token ,updateToken , updateRole}) {
    
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [reservableOnly, setReservableOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [user , setUser] = useState({});

  const fetchUser = async () => {
    try {
      setLoading(true);
      const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };
      const response = await axios.get('http://192.168.0.104:3000/user', { headers });
      console.log('User:', response.data);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data YO YO:', error);
      setLoading(false);
    }

  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };
      const response = await axios.get('http://192.168.0.104:3000/coaches/reservations', { headers });
      console.log('Reservations:', response.data);
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }


    

  };
  

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  useEffect(() => {
    let filtered = reservations.filter(reservation => {
      return (
        reservation.coach_name.toLowerCase().includes(searchText.toLowerCase()) &&
        reservation.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    });

    if (reservableOnly) {
      filtered = filtered.filter(reservation => {
        return reservation.reservation.slots.length < reservation.reservation.max_capacity;
      });
    }

    if (selectedDate) {
      filtered = filtered.filter(reservation => {
        const sessionDate = new Date(reservation.reservation.startingTime).toLocaleDateString();
        return sessionDate === selectedDate;
      });
    }

    setFilteredReservations(filtered);
  }, [searchText, locationSearch, reservableOnly, selectedDate, reservations]);

  const handleReservation = async (reservationId) => {
    Alert.alert(
      "Confirm Reservation",
      "Are you sure you want to reserve this slot?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Reservation cancelled"),
          style: "cancel"
        },
        { text: "OK", onPress: () => confirmReservation(reservationId) }
      ],
      { cancelable: false }
    );
  };
  
  const confirmReservation = async (reservationId) => {
    console.log('Reserving reservation with ID:', reservationId);
    try {
      await axios.put(`http://192.168.0.104:3000/reserve/slot`, { _id: reservationId }, { headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` } });
      fetchData();
      updateToken();
    } catch (error) {
      console.error('Error reserving:', error);
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  return (
    loading ? <ActivityIndicator size="large" color="#0000ff" /> :
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Training Sessions</Text>
        <View style={styles.filtersContainer}>
          <TextInput style={styles.searchInput} placeholder="coach name..." onChangeText={handleSearchChange} />
          <TextInput style={styles.searchInput} placeholder="location..." onChangeText={setLocationSearch} />
        </View>
        <View style={{
          marginLeft: 10,
        }}>
        <Picker
            selectedValue={reservableOnly}
            style={styles.picker}
            onValueChange={(itemValue) => setReservableOnly(itemValue)}>
            <Picker.Item label="All Sessions" value={false} />
            <Picker.Item label="Reservable Only" value={true} />
          </Picker>
          </View>
          {filteredReservations.map((reservation, index) => (
  <View key={index} style={styles.cardContainer}>
    <Text style={styles.coachName}>{reservation.coach_name}</Text>
    <Text style={styles.location}>Location: {reservation.location}</Text>
    <Text style={styles.date}>Date: {new Date(reservation.reservation.startingTime).toLocaleDateString()}</Text>
    <View style={styles.timeContainer}>
      <Text style={styles.time}>{new Date(reservation.reservation.startingTime).toLocaleTimeString()}</Text>
      <Text style={styles.timeSeparator}> ----{">"} </Text>
      <Text style={styles.time}>{new Date(reservation.reservation.endingTime).toLocaleTimeString()}</Text>
    </View>
    <Text style={styles.slots}>
      Slots: {reservation.reservation.slots.length} / {reservation.reservation.max_capacity}
    </Text>
    {reservation.reservation.slots.length < reservation.reservation.max_capacity ? (
      <TouchableOpacity
        style={reservation.reservation.slots.includes(user?._id) || !token ? [styles.reserveButton, styles.disabledButton] : styles.reserveButton}
        onPress={() => handleReservation(reservation.reservation._id)}
        disabled={reservation.reservation.slots.includes(user?._id) || !token}
      >
        <Text style={styles.reserveButtonText}>Reserve</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={[styles.reserveButton, styles.disabledButton]}
        disabled={true}
      >
        <Text style={styles.reserveButtonText}>Reserve</Text>
      </TouchableOpacity>
    )}
  </View>
))}

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 40,
    marginRight: 10,
    marginBottom: 10,
  },
  cardContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  coachName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    marginBottom: 5,
  },
  date: {
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
  },
  timeSeparator: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  slots: {
    marginBottom: 5,
  },
  reserveButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 150,
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#c0c0c0',
  },
});

