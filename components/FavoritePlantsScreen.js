import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Animated, 
  Image, 
  Modal, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoriteContext';
import { getImageSource } from '../utils/imageMap';
import globalStyles, { 
  colors, 
  normalize, 
  FONT_SIZE, 
  FONT_FAMILY, 
  FONT_WEIGHT, 
  typography 
} from '../utils/globalStyles';
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
  const { favoritePlants, removeFavorite, addFavorite, setFavoritePlants, isLoading } = useFavorites();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [lastDeletedPlant, setLastDeletedPlant] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const toggleFavorite = async (plant) => {
    // Store the plant before removing
    setLastDeletedPlant(plant);
    
    // Remove from favorites
    await removeFavorite(plant.name);
    
    // Show snackbar
    setSnackbarVisible(true);
  };

  const handleUndo = async () => {
    if (lastDeletedPlant) {
      // Add the plant back to favorites
      await addFavorite(lastDeletedPlant);
      
      // Hide snackbar and clear the lastDeletedPlant
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
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 300, 
        useNativeDriver: true 
      }).start();
      
      const timeout = setTimeout(() => {
        Animated.timing(fadeAnim, { 
          toValue: 0, 
          duration: 300, 
          useNativeDriver: true 
        }).start(() => {
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

  if (isLoading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading favorites...</Text>
      </View>
    );
  }

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
          columnWrapperStyle={favoriteCardStyles.columnWrapper}
          contentContainerStyle={favoriteCardStyles.listContentContainer}
          ListEmptyComponent={<Text style={favoriteCardStyles.emptyText}>No favourite plants yet!</Text>}
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
                    showCloseButton={true}
                    showLightStory={true}
                    onClose={handleCloseModal}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      {snackbarVisible && (
        <Animated.View style={[favoriteCardStyles.snackbar, { opacity: fadeAnim }]}>
          <Text style={favoriteCardStyles.snackbarText}>{`${lastDeletedPlant.name} removed`}</Text>
          <TouchableOpacity onPress={handleUndo}>
            <Text style={favoriteCardStyles.undoText}>Undo</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}