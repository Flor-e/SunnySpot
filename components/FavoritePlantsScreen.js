import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, Image, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoriteContext';
import { getImageSource } from '../utils/imageMap';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, typography } from '../utils/globalStyles';
import favoriteCardStyles from '../utils/favoriteCardStyles';
import PlantDetailCard from './PlantDetailCard';
import modalStyles from '../utils/modalStyles.js';

// Embedded PlantCard Component
const PlantCard = ({ plant, toggleFavorite, isFavorite, onDetailPress }) => (
  <TouchableOpacity 
    style={favoriteCardStyles.favCard}
    onPress={() => onDetailPress(plant)}
    activeOpacity={0.7}
  >
    <View style={favoriteCardStyles.imageContainer}>
      <Image source={getImageSource(plant.name)} style={favoriteCardStyles.image} />
    </View>
    <View style={favoriteCardStyles.cardInfo}>
      <Text style={favoriteCardStyles.plantName}>{plant.name}</Text>
      <Text style={favoriteCardStyles.standout}>{plant.tagline}</Text>
    </View>
    <TouchableOpacity 
      style={favoriteCardStyles.heartIcon} 
      onPress={(e) => {
        e.stopPropagation(); // Prevent triggering the card's onPress
        toggleFavorite(plant);
      }}
    >
      <Icon 
        name={isFavorite ? 'heart' : 'heart-outline'} 
        size={normalize(20)} 
        color={isFavorite ? colors.primary : colors.textDark} 
      />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function FavoritePlantsScreen() {
  const { favoritePlants, setFavoritePlants } = useFavorites();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [lastDeletedPlant, setLastDeletedPlant] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  const handlePlantDetailPress = (plant) => {
    setSelectedPlant(plant);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
    <PlantCard 
      plant={item} 
      toggleFavorite={toggleFavorite} 
      isFavorite={true} 
      onDetailPress={handlePlantDetailPress}
    /> 
  );

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerSection}>
        <Text style={globalStyles.title}>Your favourites</Text>
      </View>
      
      <View style={globalStyles.bodySection}>
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
      
      {/* Favorite Plant Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={favoriteCardStyles.modalContainer}>
            {selectedPlant && (
              <View style={favoriteCardStyles.contentWrapper}>
                <View style={favoriteCardStyles.cardContainer}>
                  <PlantDetailCard 
                    plant={selectedPlant} 
                    matchPercentage={100}
                    showCloseButton={true}
                    onClose={handleCloseModal}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
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
});