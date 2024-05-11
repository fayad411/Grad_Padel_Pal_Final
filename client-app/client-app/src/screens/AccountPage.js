import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet , RefreshControl, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp from './SignUp';
import SignIn from './SignIn';
import CompaniesHome from './companies/CompaniesHome';
import CoachProfile from './coach/CoachHome';
import UserHome from './UserHome';
import { ImageBackground } from 'react-native';


const AccountPage = ({ token, role ,updateToken , updateRole}) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      await updateToken(); 
    };
    const checkRole = async () => {
      await updateRole(); 
    };
    checkRole();

    
    checkToken();
  }, []);

  const handleSignIn = () => {
    setIsSigningUp(false);
    updateToken(); 
    updateRole(); 
  };

  const handleSignUp = () => {
    setIsSigningUp(true);
    updateToken();
    updateRole();
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    updateToken(); // Update token after sign-out
    updateRole(); // Update role after sign-out
  };

  const onRefresh = () => {
    setRefreshing(true);
    setRefresh(!refresh);
    updateToken();
    updateRole();
    
    setRefreshing(false);
  }
  

  return (
    <View style={styles.container}>
      {token ? (
        <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        >
          {role === 'user' && (
            <UserHome token={token} onSignOut={handleSignOut} role={role} refresh={refresh}/>
          )}
          {role === 'coach' && (
            <CoachProfile token={token} onSignOut={handleSignOut} role={role} refresh={refresh} />
          )}
          {role === 'company' && (
            <CompaniesHome token={token} onSignOut={handleSignOut} role={role} refresh={refresh} />
          )}
          
        </ScrollView>
      ) 
    : 
    <ImageBackground source={require('../assets/PADEL_APP _BG1.png')} style={styles.background}>
      <View>
   { isSigningUp ? (
        <>
          <SignUp onSignUp={handleSignUp} switchToSignIn={() => setIsSigningUp(false)}/>
          
        </>
      ) : (
        <>
          <SignIn onSignIn={handleSignIn} switchToSignUp={() => setIsSigningUp(true)}/>
          
        </>
      )}
            </View>
    </ImageBackground>

    }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  background: {
    resizeMode: 'cover',
    justifyContent: 'center',
    minHeight: '100%',
    minWidth: '100%',
  },


});

export default AccountPage;
