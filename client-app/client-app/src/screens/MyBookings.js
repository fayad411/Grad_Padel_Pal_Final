import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function MyBookings({ token, role, refresh }) {
  const [courtReservations, setCourtReservations] = useState([]);
  const [coachReservations, setCoachReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };
      const response = await axios.get('http://192.168.0.104:3000/user/reservations', { headers });
      setCourtReservations(response.data.courtReservations);
      setCoachReservations(response.data.coachReservations);
      setLoading(false);

      console.log('Court Reservations:', response.data.courtReservations);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const formatTime = (date) => {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  const deleteReservation = (id) => {
    console.log('Deleting reservation with id:', id);
    const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };

    axios.delete(`http://192.168.0.104:3000/user/reserve/court/${id}` , { headers })
      .then(response => {
        console.log('Reservation deleted successfully');
        fetchData();
      })
      .catch(error => {
        console.error('Error deleting reservation:', error);
      });
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this reservation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteReservation(id) },
      ],
      { cancelable: true }
    );
  };

  const canDelete = (startingTime) => {
    const now = new Date();
    const startTime = new Date(startingTime);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 4); 
    return now < startTime || now > endTime;
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>My Bookings</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <View style={styles.rowContainer}>
            {courtReservations.length === 0 && coachReservations.length === 0 && (
              <Text>No reservations found</Text>
            )}
            {courtReservations.length > 0 && (
              // <View style={{ ...styles.column, coachReservations.length > 0 ?{ width: '50%'} : { width: '100%'}}}>
              <View style={{ ...styles.column, width: coachReservations.length > 0 ? '50%' : '100%'}}>
                <Text style={styles.columnTitle}>Court Reservations</Text>
                {courtReservations.map((reservation, index) => (
                  <TouchableOpacity key={index} style={styles.card}>
                    <Text style={styles.location}>{reservation.location}</Text>
                    <Text>Starting Time: {formatTime(new Date(reservation.startingTime))}</Text>
                    <Text>Ending Time: {formatTime(new Date(reservation.endingTime))}</Text>
                    <Text>Date: {new Date(reservation.startingTime).toLocaleDateString()}</Text>
                    {canDelete(reservation.startingTime) && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          console.log('Deleting reservation:', reservation);
                          confirmDelete(reservation._id)}}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {coachReservations.length > 0 && (
              <View style={{ ...styles.column, width: courtReservations.length > 0 ? '50%' : '100%'}}>
                <Text style={styles.columnTitle}>Coach Reservations</Text>
                {coachReservations.map((reservation, index) => (
                  <TouchableOpacity key={index} style={styles.card}>
                    <Text style={styles.location}>{reservation.location}</Text>
                    <Text>Starting Time: {formatTime(new Date(reservation.startingTime))}</Text>
                    <Text>Ending Time: {formatTime(new Date(reservation.endingTime))}</Text>
                    <Text>Date: {new Date(reservation.startingTime).toLocaleDateString()}</Text>
                    <Text>Max Capacity: {reservation.max_capacity}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  column: {
    paddingHorizontal: 10,
  },
  columnTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  card: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 0,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
  },
  location: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
