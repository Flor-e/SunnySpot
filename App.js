import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFonts, NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans';
import HomeScreen from './components/HomeScreen';
import FavoritePlantsScreen from './components/FavoritePlantsScreen';
import AboutScreen from './components/AboutScreen';
import { FavoriteProvider } from './contexts/FavoriteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from './utils/fontScaling';

const Tab = createMaterialTopTabNavigator();

const PaginationDots = ({ state }) => {
  return (
    <View style={styles.paginationContainer}>
      <View style={styles.dotContainer}>
        {state.routes.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: state.index === index ? '#425f29' : '#757575' },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default function App() {
  const [spots, setSpots] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [fontsLoaded, error] = useFonts({
    NunitoSans: NunitoSans_400Regular,
    NunitoSansBold: NunitoSans_700Bold,
    NunitoSansExtraBold: NunitoSans_800ExtraBold,
  });

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.removeItem('NAVIGATION_STATE'); 
      } catch (error) {
        console.error('Error clearing navigation state:', error);
      }
    };
    clearStorage();
  }, []);

  if (!fontsLoaded && !error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#425f29" />
      </View>
    );
  }

  return (
    <FavoriteProvider>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.container}>
        <NavigationContainer ref={navigationRef} independent={true}>
          <Tab.Navigator
            initialRouteName="Home"
            tabBar={(props) => <PaginationDots {...props} />}
            screenOptions={{
              swipeEnabled: true,
              animationEnabled: true,
              tabBarShowLabel: false,
            }}
          >
            <Tab.Screen
              name="Home"
              children={(props) => (
                <HomeScreen {...props} searchHistory={searchHistory} setSearchHistory={setSearchHistory} />
              )}
              options={{ title: 'Measure & Find' }}
            />
            <Tab.Screen name="FavoritePlants" component={FavoritePlantsScreen} options={{ title: 'Liked Plants' }} />
            <Tab.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </FavoriteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: normalize(20),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: normalize(20),
    borderRadius: 10,
  },
  dot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    marginHorizontal: normalize(5),
  },
});