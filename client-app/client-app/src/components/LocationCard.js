import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const LocationCard = ({ locationName, numberOfCourts }) => {
  return (
    <Animated.View style={styles.card}>
      <Text style={styles.title}>{locationName}</Text>
      <View style={styles.courtInfo}>
        <Text style={styles.detail}>Courts Available:</Text>
        <Text style={styles.number}>{numberOfCourts}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    width: 320,
    maxWidth: '90%',
    alignSelf: 'center',
    transform: [{ scale: 1.05 }], // Slightly larger scale for emphasis
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  courtInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50', // A fresh green color to signify availability
  },
});

export default LocationCard;
