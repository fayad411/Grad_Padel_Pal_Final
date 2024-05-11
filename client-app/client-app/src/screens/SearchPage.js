import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import CompanyPage from './CompanyPage';
const SearchPage = ({ token, role }) => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleCompanyPress = (company) => {
    setSelectedCompany(company);
  };

  const onBack = () => {
    setSelectedCompany(null);
    };

  useEffect(() => {
    setLoading(true);
    const headers = { 'Content-Type': 'application/json', 'Authorization': `${token}` };
    axios.all([
      axios.get('http://192.168.0.104:3000/companies', { headers }),
      axios.get('http://192.168.0.104:3000/company/Locations/all', { headers })
    ])
    .then(axios.spread((companiesResponse, locationsResponse) => {
      const companies = companiesResponse.data.map((company) => {
        return {
          _id: company.company._id,
          name: company.company.name,
          phone: company.company.phone,
          locations: company.locations,
          profile_image: company.company.profile_image? company.company.profile_image : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
        };
      });
      setCompanies(companies);
      console.log('Companies:', companies);
      setFilteredCompanies(companies);
      setFilteredLocations(locationsResponse.data);
      setLoading(false);
    }))
    .catch((error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filtered = companies.filter(company => {
      return company.locations.some(location => location.toLowerCase().includes(locationSearch.toLowerCase()));
    });
    setFilteredCompanies(filtered);
  }, [locationSearch, companies]);

  useEffect(() => {
    const filtered = companies.filter(company => {
      return company.name.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredCompanies(filtered);
  }, [searchText, companies]);


  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  return (
selectedCompany ? (
    <CompanyPage token={token} company_id={selectedCompany} onBack={onBack} role={role}/>
    ) : (
      <ScrollView>
    <View >
      <View style={styles.topBar}>
        <Image source={require('../assets/PADEL_PAL_LOGO.png')} style={styles.logo} />
        <Text style={styles.appName}>PadelPal</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search company..." onChangeText={handleSearchChange} />
        <TextInput style={styles.searchInput} placeholder="Search location..." onChangeText={setLocationSearch} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.companyList}>
          {filteredCompanies.map((company) => (
            <TouchableOpacity key={company._id} style={styles.companyButton} onPress={() => handleCompanyPress(company._id)}>

                <Image source={{ uri: company.profile_image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
              <Text style={styles.companyButtonText}>{company.name}</Text>
              <Text style={{ color: 'gray', fontSize: 12 }}>{company.phone && company.phone}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  </ScrollView>
    )
  );
};

const styles = StyleSheet.create({

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    width: '100%',
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    zIndex: 999, 
},
  logo: {
    width: 50,
    height: 50,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 100,
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
  },
  companyList: {
    alignItems: 'center',
    display: 'flex',
    marginTop: 20,
  },
  companyButton: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    width: 350,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyButtonText: {
    fontSize: 20,
  },
});

export default SearchPage;
