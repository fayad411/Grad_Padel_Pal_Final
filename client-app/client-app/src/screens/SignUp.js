import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Button, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the eye icon from FontAwesome
import { ImageBackground } from 'react-native';
const Signup = ({ onSignUp, switchToSignIn }) => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 

  const handleSignup = async () => {
    try {
      console.log('Signing up as:', role, 'with email:', email, 'and password:', password);
      let url = '';
      if (role === 'user') {
        url = 'http://192.168.0.104:3000/signup';
      };
      if (role === 'coach') {
        url = 'http://192.168.0.104:3000/signup/coach';
      };
      if (role === 'company') {
        url = 'http://192.168.0.104:3000/signup/company';
      };

      console.log(url);
      const response = await axios.post(url, {
        email: email,
        password: password,
        phone: phoneNumber,
        name: name,
        aboutMe: aboutMe,
      });
      console.log('Sign up response:', response.data);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('role', response.data.role);

      onSignUp();
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
        setModalVisible(true);
      } else {
        setError("An error occurred");
        setModalVisible(true);
      }
    }
  };



  const evaluatePasswordStrength = (password) => {
    // Evaluate password strength based on length and complexity
    const passwordLength = password.length;
    if (passwordLength < 6) {
      return 'weak';
    } else if (passwordLength < 10) {
      return 'normal';
    } else if (password.match(/[a-zA-Z]/) && password.match(/[0-9]/) && password.match(/[!@#$%^&*]/)) {
      return 'strong';
    } else {
      return 'normal';
    }
  };

  const getPasswordStrengthColor = (strength) => {
    // Map password strength to color gradient
    switch (strength) {
      case 'weak':
        return 'red';
      case 'normal':
        return 'orange';
      case 'strong':
        return 'green';
      default:
        return 'gray';
    }
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

  const renderPasswordStrengthBar = () => {
    const strength = evaluatePasswordStrength(password);
    const color = getPasswordStrengthColor(strength);
    const widthPercentage = {
      weak: '25%',
      normal: '50%',
      strong: '75%',
    };
    console.log('Password strength:', strength, 'Color:', color);
    return (
      <View style={[styles.passwordStrengthContainer, { backgroundColor: color }]}>
        <View style={[styles.passwordStrengthBar, { width: widthPercentage[strength], backgroundColor: color }]} />
      </View>
    );
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    renderPasswordStrengthBar();

  };
  const renderRoles = () => (
    <View style={styles.rolesContainer}>
      <View style={styles.headerLogo}>
        <Image
          source={require('../assets/PADEL_PAL_LOGO.png')}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.asText}>As a</Text>
      <View style={styles.roleButtonsContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'user' && styles.selectedRole]}
          onPress={() => setRole('user')}
        >
          <Text style={styles.roleText}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'coach' && styles.selectedRole]}
          onPress={() => setRole('coach')}
        >
          <Text style={styles.roleText}>Coach</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'company' && styles.selectedRole]}
          onPress={() => setRole('company')}
        >
          <Text style={styles.roleText}>Company</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderSignupForm = () => (
    <ScrollView style={{
      width: '100%',
    }}>
    <View style={modalVisible ? { ...styles.signupForm, opacity: 0.2 } : styles.signupForm}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{error}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require('../assets/PADEL_APP _BG1.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.headerLogo}>
          <Image
            source={require('../assets/PADEL_PAL_LOGO.png')}
            style={styles.logo}
          />
        </View>
    <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setName(text)}
          value={name}
        />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => {
                            setEmail(text);
                            if (!isValidEmail(text)) {
                                setError("Invalid email format");
                            } else {
                                setError(null);
                            }
                        }}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordInputContainer}>
          
          <TextInput
            style={[styles.input, styles.passwordInput]}
            onChangeText={handlePasswordChange}
            value={password}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="blue" style={styles.togglePasswordIcon} />
          </TouchableOpacity>
        </View>
        {password.length > 0 && renderPasswordStrengthBar()}
        {password.length > 0 && (
            <>
              {password.length < 6 && (
                <Text style={styles.requirement}>- Password must be at least 6 characters</Text>
              )}
              {!password.match(/[a-zA-Z]/) && (
                <Text style={styles.requirement}>- Password must contain at least 1 letter</Text>
              )}
              {!password.match(/[0-9]/) && (
                <Text style={styles.requirement}>- Password must contain at least 1 number</Text>
              )}
              {!password.match(/[!@#$%^&*]/) && (
                <Text style={styles.requirement}>- Password must contain at least 1 special character</Text>
              )}
            </>
          )}

        
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setPhoneNumber(text)}
          value={phoneNumber}
          keyboardType="phone-pad"
        />
        {role === 'coach' && (
          <>
          <Text style={styles.label}>About Me</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            onChangeText={text => setAboutMe(text)}
            value={aboutMe}
            multiline
          />
          </>
        )}
        <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.linkText} onPress={switchToSignIn}>Already have an account? Sign In</Text>
        </View>
      </ImageBackground>
      
    </View>
    </ScrollView>
  );


  return (
    <>
      <View style={styles.titleContainer} />
      <View style={styles.container}>
        {role === '' ? renderRoles() : renderSignupForm()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    marginBottom: 10,
    textAlign : 'left',
    alignSelf : 'flex-start',
    marginLeft : 10,

  },
  requirement: {
    color: 'red',
    fontSize: 12,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 100,
    paddingTop: 20,
  },
  titleContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 380,
    height: 280,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
},
  rolesContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  asText: {
    fontSize: 18,
    marginBottom: 10,
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  selectedRole: {
    borderColor: '#007bff',
  },
  roleText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signupForm: {
    alignItems: 'center',
  },
  input: {
    width: 280,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
  },
  togglePasswordIcon: {
    paddingHorizontal: 10,
  },
  signupButton: {
    backgroundColor: '#007bff',
    marginTop: 20,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText : {
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 12,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,

    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordStrengthContainer: {
    width: 250,
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordStrengthBar: {
    height: 10,
    borderRadius: 5,
    marginBottom : 20,
  },

});

export default Signup;
