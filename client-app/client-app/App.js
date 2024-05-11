import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import your screen components here
import Homescreen from './src/screens/Homescreen';
import SearchPage from './src/screens/SearchPage';
import AccountPage from './src/screens/AccountPage';
import CoachesSessions from './src/screens/coach/CoachesSessions';

const Tab = createBottomTabNavigator();

const App = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    const checkRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      setRole(storedRole);
    };
    checkRole();
    checkToken();
  }, []);

  const updateToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    setToken(storedToken);
  };

  const updateRole = async () => {
    const storedRole = await AsyncStorage.getItem('role');
    setRole(storedRole);
  };

  // Define your screen components
  const HomescreenComponent = () => {
    const navigation = useNavigation();
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // Fetch data or perform actions when the screen gains focus
      });
      return unsubscribe;
    }, [navigation]);
    return <Homescreen token={token} role={role} 
    onNavigateToAccount={() => {
      navigation.navigate('Account');
    }}
    onNavigateToSearch={() => {
      navigation.navigate('Search');
    }}
    onSupport={() => {
      navigation.navigate('Coaches');
    }}
    />;
  };

  const SearchPageComponent = () => {
    const navigation = useNavigation();
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // Fetch data or perform actions when the screen gains focus
      });
      return unsubscribe;
    }, [navigation]);
    return <SearchPage token={token} role={role} />;
  };

  const AccountPageComponent = () => {
    const navigation = useNavigation();
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // Fetch data or perform actions when the screen gains focus
      });
      return unsubscribe;
    }, [navigation]);
    return <AccountPage token={token} role={role} updateToken={updateToken} updateRole={updateRole}/>;
  };

  const CoachesSessionsComponent = () => {
    const navigation = useNavigation();
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {

      });
      return unsubscribe;
    }, [navigation]);
    return <CoachesSessions token={token} updateRole={updateRole} updateToken={updateToken} />;
  };

  return (
    <GestureHandlerRootView>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Coaches') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
<Tab.Screen
          name="Home"
          options={({ navigation }) => ({
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          })}
        >
          {(props) => (
            <Homescreen
              {...props}
              token={token}
              role={role}
              onNavigateToAccount={() => props.navigation.navigate('Account')}
              onNavigateToSearch={() => props.navigation.navigate('Search')}
              onSupport={() => props.navigation.navigate('Coaches')}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Coaches" component={CoachesSessionsComponent} />
        <Tab.Screen name="Search" component={SearchPageComponent} />
        <Tab.Screen name="Account" component={AccountPageComponent}/>
      </Tab.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
