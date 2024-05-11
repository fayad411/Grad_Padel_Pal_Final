import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import LocationCard from '../components/LocationCard';
import CourtDetails from './CourtDetailsScreen';

const CompanyPage = ({ token, company_id, onBack, role }) => {
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_image: '',
    courtsLocations: []
  });
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    const getCompanyData = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
      };
      try {
        const locationsResponse = await axios.post(`http://192.168.0.104:3000/company/locations`, { _id: company_id }, { headers });
        const companyResponse = await axios.get(`http://192.168.0.104:3000/company/by/id/${company_id}`, { headers });
        setCompanyData({
          ...companyData,
          name: companyResponse.data.name,
          email: companyResponse.data.email,
          phone: companyResponse.data.phone,
          profile_image: companyResponse.data.profile_image,
          courtsLocations: locationsResponse.data
        });
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    getCompanyData();
  }, []);

  return (
    isSelectingLocation ? (
      <CourtDetails
        token={token}
        role={role}
        company_id={company_id}
        onBackToCompany={() => {
          setIsSelectingLocation(false);
          setLocationName('');
        }}
        locationName={locationName}
        company_name={companyData.name}
      />
    ) : (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.companyName}>{companyData.name}</Text>
          </View>

          <Image source={{ uri: companyData.profile_image }} style={styles.profileImage} />
          <Text style={styles.contactInfo}>{companyData.email}</Text>
          <Text style={styles.contactInfo}>Phone: {companyData.phone}</Text>
          <Text style={styles.sectionTitle}>Available Locations</Text>

          <View style={styles.locationsContainer}>
            {companyData.courtsLocations.length === 0 ? (
              <Text style={styles.noLocations}>No locations available</Text>
            ) : (
              companyData.courtsLocations.map((location) => (
                <TouchableOpacity
                  key={location._id}
                  onPress={() => {
                    setIsSelectingLocation(true);
                    setLocationName(location.location);
                  }}
                  style={styles.locationCard}
                >
                  <LocationCard locationName={location.location} numberOfCourts={location.courts} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    )
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 22,
    fontWeight: '600',
  },
  profileImage: {
    width: 220,
    height: 170,
    borderRadius: 60,
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  locationsContainer: {
    width: '100%',
  },
  locationCard: {
    marginBottom: 10,
  },
  noLocations: {
    fontSize: 16,
    color: '#888',
  },
});

export default CompanyPage;
