import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, Animated, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoriteContext';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY } from '../utils/globalStyles';
import { getPlantsForLux, getLightLevel } from '../utils/plantAdvice';
import PlantDetailCard from './PlantDetailCard';
import modalStyles from '../utils/modalStyles.js';
import plantCardStyles from '../utils/plantCardStyles.js';

const PlantAdviceModal = ({ visible, plantAdvice, filters, onClose, label = 'This Spot' }) => {
  const [plantDeck, setPlantDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSkippedPlant, setLastSkippedPlant] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Track if this is the initial load or after swiping

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
      setInitialLoad(true); // Reset initialLoad when modal becomes visible
      translateX.setValue(0);
      rotate.setValue(0);
      opacity.setValue(1);
      // Hide any active snackbar when modal becomes visible
      setSnackbarVisible(false);
    }
  }, [visible, plantAdvice, filters]);

  // When the user swipes, set initialLoad to false
  useEffect(() => {
    if (currentIndex > 0) {
      setInitialLoad(false);
    }
  }, [currentIndex]);

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
        <View style={plantCardStyles.backdrop} />
        <View style={plantCardStyles.modalContainer}>
          {currentPlant ? (
            <View style={plantCardStyles.contentWrapper}>
              {/* Light measurement badge now outside the card */}
              {plantAdvice?.lux && (
                <View style={plantCardStyles.luxBadgeContainer}>
                  <View style={plantCardStyles.luxBadge}>
                    <Icon name="flash-outline" size={normalize(14)} color="#757575" style={plantCardStyles.luxIcon} />
                    <Text style={plantCardStyles.luxText}>
                      {`Measured: ${getLightLevel(plantAdvice.lux)} (${plantAdvice.lux} lux)`}
                    </Text>
                  </View>
                </View>
              )}
              
              <PanGestureHandler
                onGestureEvent={onGesture}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetX={[-10, 10]}
              >
                <Animated.View
                  style={[
                    plantCardStyles.cardContainer,
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
            <View style={plantCardStyles.noMorePlants}>
              {plantDeck.length === 0 && initialLoad ? (
                <>
                  <Text style={plantCardStyles.noMoreText}>No plants found</Text>
                  <Text style={plantCardStyles.noMatchExplanation}>
                    Sorry, we couldn't find any plants that match your criteria. 
                    Try adjusting your filters or taking a measurement in a different 
                    spot with more light.
                  </Text>
                </>
              ) : (
                <Text style={plantCardStyles.noMoreText}>No more matches!</Text>
              )}
              <TouchableOpacity style={plantCardStyles.closeButton} onPress={onClose}>
                <Text style={modalStyles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Undo Snackbar */}
          {snackbarVisible && lastSkippedPlant && (
            <Animated.View style={[plantCardStyles.snackbar, { opacity: fadeAnim }]}>
              <Text style={plantCardStyles.snackbarText}>{`${lastSkippedPlant.name} passed`}</Text>
              <TouchableOpacity onPress={handleUndo}>
                <Text style={plantCardStyles.undoText}>Undo</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default PlantAdviceModal;