import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, Image, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoriteContext';
import { getImageSource } from '../utils/imageMap';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY } from '../utils/globalStyles';
import PlantDetailCard from './PlantDetailCard';

// Embedded PlantCard Component
const PlantCard = ({ plant, toggleFavorite, isFavorite, onDetailPress }) => (
  <View style={globalStyles.favCard}>
    <TouchableOpacity onPress={() => onDetailPress(plant)} style={globalStyles.imageContainer}>
      <Image source={getImageSource(plant.name)} style={globalStyles.image} />
    </TouchableOpacity>
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
      
      {/* Favorite Plant Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.backdrop} />
          <View style={styles.modalContainer}>
            {selectedPlant && (
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
              }}>
                <View
                  style={{
                    position: 'absolute',
                    top: normalize(10),
                    right: normalize(10),
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.closeIconButton}>
                      <Icon name="close-outline" size={normalize(20)} color="#757575" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedPlant && (
              <View style={styles.contentWrapper}>
                <View style={styles.cardContainer}>
                  <PlantDetailCard 
                    plant={selectedPlant} 
                    matchPercentage={100}
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '100%',
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: normalize(30),
    height: normalize(30),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: colors.accentMedium,
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