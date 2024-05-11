import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignIn = ({ onSignIn ,switchToSignUp}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 

    const handleSignIn = async () => {
        try {

            const response = await axios.post('http://192.168.0.104:3000/login', {
                email: email,
                password: password,
            });
            console.log('Sign in response:', response.data);
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('role', response.data.role);
            console.log('Signing in with email:', email, 'and password:', password);
            onSignIn();
        } catch (error) {
            setError(error.response.data); 
            setModalVisible(true); 
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/PADEL_APP _BG1.png')}
                style={styles.backgroundImage}
            >
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/PADEL_PAL_LOGO.png')}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.formContainer}>
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
                            style={styles.passwordInput}
                            onChangeText={text => setPassword(text)}
                            value={password}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="blue" />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.linkText} onPress={switchToSignUp}>Don't have an account? Sign Up</Text>
            </ImageBackground>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{error}</Text>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 5,
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 10,
        width: '50%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    label: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    togglePasswordText: {
        paddingHorizontal: 10,
        color: 'blue',
    },
    passwordRequirement: {
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
});

export default SignIn;