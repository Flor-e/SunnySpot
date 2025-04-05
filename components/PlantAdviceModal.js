import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, Animated, Image, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoriteContext';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from '../utils/globalStyles';
import { getPlantsForLux } from '../utils/plantAdvice';
import { getImageSource } from '../utils/imageMap';

const PlantAdviceModal = ({ visible, plantAdvice, filters, onClose, label = 'This Spot' }) => {
  const [plantDeck, setPlantDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { favoritePlants, setFavoritePlants } = useFavorites();

  const translateX = new Animated.Value(0);
  const rotate = new Animated.Value(0);
  const opacity = new Animated.Value(1);
  const closeButtonOpacity = new Animated.Value(1);

  useEffect(() => {
    if (visible && plantAdvice?.lux !== null && plantAdvice?.lux !== undefined) {
      const matches = getPlantsForLux(plantAdvice.lux, filters) || [];
      setPlantDeck(matches);
      setCurrentIndex(0);
      translateX.setValue(0);
      rotate.setValue(0);
      opacity.setValue(1);
      closeButtonOpacity.setValue(1);
    }
  }, [visible, plantAdvice, filters]);

  const onGesture = ({ nativeEvent }) => {
    const { translationX } = nativeEvent;
    translateX.setValue(translationX);
    rotate.setValue(translationX / 300);
    
    // Immediately hide the close button when any swipe begins
    if (Math.abs(translationX) > 0) {
      closeButtonOpacity.setValue(0);
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
          }
          setCurrentIndex((prev) => prev + 1);
          translateX.setValue(0);
          rotate.setValue(0);
          closeButtonOpacity.setValue(1); 
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
          Animated.timing(closeButtonOpacity, {
            toValue: 1, 
            duration: 200,
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

  const getLuxLabel = (luxValue) => {
    if (luxValue <= 500) return 'very low light';
    if (luxValue <= 2000) return 'low light';
    if (luxValue <= 10000) return 'moderate light';
    if (luxValue <= 20000) return 'bright light';
    return 'direct sunlight';
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.modalOverlay}>
        <View style={styles.backdrop} />
        <View style={styles.modalContainer}>
          {/* Close button with separate opacity animation */}
          {currentPlant && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  top: normalize(10),
                  right: normalize(10),
                  opacity: closeButtonOpacity,
                }}
              >
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <View style={styles.closeIconButton}>
                    <Icon name="close-outline" size={normalize(20)} color="#757575" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}

          {currentPlant ? (
            <View style={styles.contentWrapper}>
              <PanGestureHandler
                onGestureEvent={onGesture}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetX={[-10, 10]}
              >
                <View style={styles.cardContainer}>
                  <Animated.View
                    style={[
                      styles.plantCard,
                      {
                        transform: [
                          { translateX },
                          { rotate: rotateInterpolate },
                        ],
                      },
                    ]}
                  >
                    <View style={styles.cardWrapper}>
                      <View style={[styles.cardSide, styles.frontSide]}>
                        <Image
                          source={getImageSource(currentPlant.name)}
                          style={styles.plantImage}
                        />
                        <View style={styles.luxContainer}>
                          <View style={styles.luxBadge}>
                            <Icon name="flash-outline" size={normalize(14)} color="#757575" style={styles.luxIcon} />
                            <Text style={styles.luxText}>
                              {`${label}: ${getLuxLabel(plantAdvice?.lux || 0)} (${plantAdvice?.lux || 0} lux)`}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.plantName}>{currentPlant.name}</Text>
                        <Text style={[styles.plantStandout, styles.italicTagline]}>{currentPlant.tagline}</Text>
                        <View style={styles.infoGrid}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoTile}>
                              <Icon name="resize-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                              <Text style={styles.infoText}>{`Up to ${currentPlant.height || 'Unknown height'}`}</Text>
                            </View>
                            <View style={styles.infoTile}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="water-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                                <Text style={styles.infoText}>{currentPlant.waterRequirement || 'Unknown'}</Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.infoRow}>
                            <View style={styles.infoTile}>
                              <Icon name="checkmark-circle-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                              <Text style={styles.infoText}>{`${currentPlant.matchPercentage || 0}% match`}</Text>
                            </View>
                            <View style={styles.infoTile}>
                              <Icon name="paw-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                              <Text style={styles.infoText}>{currentPlant.petSafetyDetail || 'Unknown'}</Text>
                            </View>
                          </View>
                          <View style={styles.infoRow}>
                            <View style={styles.infoTile}>
                              <Icon name="heart-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                              <Text style={styles.infoText}>{currentPlant.loveLanguage || 'Unknown'}</Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.swipeHint}>
                          <Icon name="arrow-back-outline" size={normalize(14)} color="#757575" style={styles.hintIcon} />
                          <Text style={styles.swipeText}>swipe to pass</Text>
                          <Text style={styles.separator}> | </Text>
                          <Text style={styles.swipeText}>swipe to save</Text>
                          <Icon name="arrow-forward-outline" size={normalize(14)} color="#757575" style={styles.hintIcon} />
                        </View>
                        <View style={styles.cardCounter}>
                          <Text style={styles.counterText}>
                            {currentIndex + 1}/{plantDeck.length}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                </View>
              </PanGestureHandler>
            </View>
          ) : (
            <View style={styles.noMorePlants}>
              <Text style={styles.noMoreText}>No more matches!</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={globalStyles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  luxHighlight: {
    color: colors.accent,
    fontFamily: FONT_FAMILY.BOLD,
  },
  matchPercentage: {
    color: colors.accent,
    fontFamily: FONT_FAMILY.BOLD,
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
  plantCard: {
    width: '100%',
    flexDirection: 'column',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardWrapper: {
    width: '100%',
  },
  cardSide: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  frontSide: {
    flexDirection: 'column',
    padding: normalize(20),
    alignItems: 'center',
  },
  plantImage: {
    width: '100%',
    height: normalize(200),
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: normalize(15),
  },
  luxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  luxBadge: {
    backgroundColor: colors.background,
    borderRadius: 15,
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(10),
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  luxIcon: {
    marginRight: normalize(8),
  },
  luxText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
    textAlign: 'center',
  },
  plantName: {
    fontSize: FONT_SIZE.HEADER,
    fontFamily: FONT_FAMILY.BOLD,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  plantStandout: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
    textAlign: 'center',
    marginBottom: normalize(15),
    lineHeight: normalize(22),
    paddingHorizontal: normalize(10),
  },
  italicTagline: {
    fontStyle: 'italic',
  },
  infoGrid: {
    width: '100%',
    marginBottom: normalize(15),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  infoTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: normalize(5),
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
    backgroundColor: colors.primaryLighter,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  infoIcon: {
    marginRight: normalize(8),
  },
  infoText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  swipeText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
  },
  hintIcon: {
    marginRight: normalize(4),
  },
  separator: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
    marginHorizontal: normalize(5),
  },
  cardCounter: {
    marginTop: normalize(15),
    marginBottom: 0,
    backgroundColor: colors.accent,
    paddingVertical: normalize(2),
    paddingHorizontal: normalize(10),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  counterText: {
    fontSize: FONT_SIZE.SMALL,
    fontFamily: FONT_FAMILY.BOLD,
    color: colors.textLight,
  },
  noMorePlants: {
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: normalize(20),
    borderRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
});

export default PlantAdviceModal;