import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoriteContext';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from '../utils/globalStyles';
import { getImageSource } from '../utils/imageMap';

// Embedded PlantCard Component
const PlantCard = ({ plant, toggleFavorite, isFavorite }) => (
  <View style={globalStyles.favCard}>
    <View style={globalStyles.imageContainer}>
      <Image source={getImageSource(plant.name)} style={globalStyles.image} />
    </View>
    <View style={globalStyles.cardInfo}>
      <Text style={globalStyles.plantName}>{plant.name}</Text>
      <Text style={globalStyles.standout}>{plant.tagline}</Text>
    </View>
    <TouchableOpacity style={globalStyles.heartIcon} onPress={() => toggleFavorite(plant)}>
      <Icon 
        name={isFavorite ? 'heart' : 'heart-outline'} 
        size={normalize(20)} 
        color={isFavorite ? colors.primary : colors.textDark} 
      />
    </TouchableOpacity>
  </View>
);

export default function FavoritePlantsScreen() {
  const { favoritePlants, setFavoritePlants } = useFavorites();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [lastDeletedPlant, setLastDeletedPlant] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const toggleFavorite = (plant) => {
    setFavoritePlants((prev) => {
      const updatedFavorites = prev.filter((p) => p.name !== plant.name);
      setLastDeletedPlant(plant);
      setSnackbarVisible(true);
      return updatedFavorites;
    });
  };

  const handleUndo = () => {
    if (lastDeletedPlant) {
      setFavoritePlants((prev) => [...prev, lastDeletedPlant]);
      setSnackbarVisible(false);
      setLastDeletedPlant(null);
    }
  };

  useEffect(() => {
    if (snackbarVisible) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      const timeout = setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          setSnackbarVisible(false);
          setLastDeletedPlant(null);
        });
      }, 5000);
      return () => clearTimeout(timeout);
    } else {
      fadeAnim.setValue(0); // Reset animation when hidden
    }
  }, [snackbarVisible, fadeAnim]);

  const renderItem = ({ item }) => (
    <PlantCard plant={item} toggleFavorite={toggleFavorite} isFavorite={true} /> 
  );

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerSection}>
        <Text style={globalStyles.title}>Your favourites</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <FlatList
          data={favoritePlants}
          renderItem={renderItem}
          keyExtractor={(item) => item.name} 
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No favourite plants yet!</Text>}
        />
      </View>
      
      {snackbarVisible && (
        <Animated.View style={[styles.snackbar, { opacity: fadeAnim }]}>
          <Text style={styles.snackbarText}>{`${lastDeletedPlant.name} removed`}</Text>
          <TouchableOpacity onPress={handleUndo}>
            <Text style={styles.undoText}>Undo</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingTop: normalize(20), 
  },
  columnWrapper: { 
    justifyContent: 'flex-start', 
    paddingHorizontal: normalize(10) 
  },
  listContentContainer: { 
    paddingVertical: normalize(10), 
    paddingBottom: normalize(80) 
  },
  emptyText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
    textAlign: 'center',
    padding: normalize(20),
  },
  snackbar: {
    position: 'absolute',
    bottom: normalize(80),
    left: normalize(20),
    right: normalize(20),
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  snackbarText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
  },
  undoText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.BOLD,
    color: '#425f29',
  },
});