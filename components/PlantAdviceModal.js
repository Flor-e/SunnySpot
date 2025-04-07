import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, Animated, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoriteContext';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY } from '../utils/globalStyles';
import { getPlantsForLux } from '../utils/plantAdvice';
import PlantDetailCard from './PlantDetailCard';
import modalStyles from '../utils/modalStyles.js';

const PlantAdviceModal = ({ visible, plantAdvice, filters, onClose, label = 'This Spot' }) => {
  const [plantDeck, setPlantDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSkippedPlant, setLastSkippedPlant] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const { favoritePlants, setFavoritePlants } = useFavorites();

  const translateX = new Animated.Value(0);
  const rotate = new Animated.Value(0);
  const opacity = new Animated.Value(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && plantAdvice?.lux !== null && plantAdvice?.lux !== undefined) {
      const matches = getPlantsForLux(plantAdvice.lux, filters) || [];
      setPlantDeck(matches);
      setCurrentIndex(0);
      translateX.setValue(0);
      rotate.setValue(0);
      opacity.setValue(1);
      // Hide any active snackbar when modal becomes visible
      setSnackbarVisible(false);
    }
  }, [visible, plantAdvice, filters]);

  // Snackbar animation
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
          setLastSkippedPlant(null);
        });
      }, 5000);
      
      return () => clearTimeout(timeout);
    } else {
      fadeAnim.setValue(0); // Reset animation when hidden
    }
  }, [snackbarVisible, fadeAnim]);

  const onGesture = ({ nativeEvent }) => {
    const { translationX } = nativeEvent;
    translateX.setValue(translationX);
    rotate.setValue(translationX / 300);
  };

  const handleUndo = () => {
    if (lastSkippedPlant !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSnackbarVisible(false);
      setLastSkippedPlant(null);
    }
  };

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const swipeThreshold = 120;
      if (Math.abs(nativeEvent.translationX) > swipeThreshold) {
        const direction = nativeEvent.translationX > 0 ? 'right' : 'left';
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: direction === 'right' ? 500 : -500,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: direction === 'right' ? 0.3 : -0.3,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (direction === 'right' && currentIndex < plantDeck.length) {
            const plant = plantDeck[currentIndex];
            if (plant && !favoritePlants.some((fav) => fav.name === plant.name)) {
              setFavoritePlants((prev) => [...prev, plant]);
            }
          } else if (direction === 'left' && currentIndex < plantDeck.length) {
            // Store the plant that was swiped left (passed)
            setLastSkippedPlant(plantDeck[currentIndex]);
            setSnackbarVisible(true);
          }
          
          setCurrentIndex((prev) => prev + 1);
          translateX.setValue(0);
          rotate.setValue(0);
        });
      } else {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  const currentPlant = currentIndex < plantDeck.length ? plantDeck[currentIndex] : null;

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <GestureHandlerRootView style={modalStyles.modalOverlay}>
        <View style={styles.backdrop} />
        <View style={styles.modalContainer}>
          {currentPlant ? (
            <View style={styles.contentWrapper}>
              <PanGestureHandler
                onGestureEvent={onGesture}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetX={[-10, 10]}
              >
                <Animated.View
                  style={[
                    styles.cardContainer,
                    {
                      transform: [
                        { translateX },
                        { rotate: rotateInterpolate },
                      ],
                    },
                  ]}
                >
                  <PlantDetailCard 
                    plant={currentPlant} 
                    showLuxBadge={true}
                    luxLabel={label}
                    luxValue={plantAdvice?.lux}
                    matchPercentage={currentPlant.matchPercentage}
                    currentIndex={currentIndex}
                    totalPlants={plantDeck.length}
                    showSwipeHint={true}
                    showCloseButton={true}
                    onClose={handleCloseModal}
                  />
                </Animated.View>
              </PanGestureHandler>
            </View>
          ) : (
            <View style={styles.noMorePlants}>
              <Text style={styles.noMoreText}>No more matches!</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={modalStyles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Undo Snackbar */}
          {snackbarVisible && lastSkippedPlant && (
            <Animated.View style={[styles.snackbar, { opacity: fadeAnim }]}>
              <Text style={styles.snackbarText}>{`${lastSkippedPlant.name} passed`}</Text>
              <TouchableOpacity onPress={handleUndo}>
                <Text style={styles.undoText}>Undo</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  noMorePlants: {
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
    padding: normalize(20),
    borderRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  noMoreText: {
    fontSize: FONT_SIZE.LARGE,
    fontFamily: FONT_FAMILY.BOLD,
    color: colors.textPrimary,
    marginBottom: normalize(20),
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(20),
    borderRadius: 8,
  },
  snackbar: {
    position: 'absolute',
    bottom: normalize(-60),
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
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  snackbarText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
  },
  undoText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.BOLD,
    color: colors.textPrimary,
  },
});

export default PlantAdviceModal;