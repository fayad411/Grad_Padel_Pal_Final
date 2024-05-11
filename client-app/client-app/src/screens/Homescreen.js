import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const Homescreen = ({ token, role, onNavigateToAccount, onNavigateToSearch, onSupport }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    let url = 'http://192.168.0.104:3000/user';
    if (role === 'user') {
      url = 'http://192.168.0.104:3000/user';
    }
    if (role === 'coach') {
      url = 'http://192.168.0.104:3000/coach';
    }
    if (role === 'company') {
      url = 'http://192.168.0.104:3000/company';
    }

    const getUsername = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      };
      axios.get(url, { headers })
        .then((response) => {
          setUsername(response.data.name);
        })
        .catch((error) => {
        });
    };

    getUsername();
  }, [token, role]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Customized Header */}
        <View style={styles.customHeader}>
          <View style={styles.headerLogo}>
            <Image
              source={require('../assets/PADEL_PAL_LOGO.png')}
              style={styles.logo}
            />
          </View>
        </View>


        <TouchableOpacity style={styles.button} onPress={onNavigateToSearch}>
          <Image
            source={{uri: 'https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg'}}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <Text style={[styles.buttonText, styles.overlayText]}>Browse all courts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onSupport}>
          <Image
            source={{uri: 'https://i0.wp.com/thepadelpaper.com/wp-content/uploads/2023/07/padel-coach-teaching-man-forehand.jpg?fit=1200%2C812&ssl=1'}}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <Text style={[styles.buttonText, styles.overlayText]}>Browse all coaches</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.anotherbutton} onPress={onSupport}>
            <View style={styles.svgContainer}>
              <Ionicons name="people" size={50} color="#333" />
            </View>
            <Text style={styles.anotherbuttonText}>Coaches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.anotherbutton} onPress={onNavigateToSearch}>
            <View style={styles.svgContainer}>
              <Ionicons name="search" size={50} color="#333" />
            </View>
            <Text style={styles.anotherbuttonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.anotherbutton} onPress={onNavigateToAccount}>
            <View style={styles.svgContainer}>
              <Ionicons name="person" size={50} color="#333" />
            </View>
            <Text style={styles.anotherbuttonText}>My Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.anotherbutton} onPress={onNavigateToAccount}>
            <View style={styles.svgContainer}>
              <Ionicons name="calendar" size={50} color="#333" />
            </View>
            <Text style={styles.anotherbuttonText}>My Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  customHeader: {
    alignItems: 'center',
    marginTop: 50,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 380,
    height: 180,
    resizeMode: 'contain',
    marginRight: 10,
  },
  appName: {
    fontSize: 36,
    color: '#333',
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00FF00',
    borderColor: '#000',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative', 
    overflow: 'hidden', 
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    position: 'relative', 
  },
  anotherbutton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    width: '48%',
  },
  svgContainer: {
    width: 50,
    height: 50,
    marginLeft: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  anotherbuttonText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 14,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Set a negative z-index to render behind the text
  },
  overlayText: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 20,
    borderRadius: 10,
  },
});

export default Homescreen;
