import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getImageSource } from '../utils/imageMap';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY } from '../utils/globalStyles';

const PlantDetailCard = ({
  plant,
  showLuxBadge = false,
  luxLabel = '',
  luxValue = 0,
  matchPercentage = null,
  currentIndex = null,
  totalPlants = null,
  showSwipeHint = false,
  showCloseButton = false,
  onClose = null
}) => {
  // Create animated value references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Set up the combined animation when the component mounts
  useEffect(() => {
    // Use spring for scale animation for more natural feel
    Animated.parallel([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      // Scale up animation with spring effect
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8, // Controls "bounciness" (higher = less bounce)
        tension: 40, // Controls speed (higher = faster)
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.plantCard, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }] 
        }
      ]}
    >
      <View style={styles.cardWrapper}>
        <View style={[styles.cardSide, styles.frontSide]}>
          {/* Close button (included in the animation) */}
          {showCloseButton && onClose && (
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={styles.closeIconButton}
              >
                <Icon name="close-outline" size={normalize(20)} color="#757575" />
              </TouchableOpacity>
            </View>
          )}
          
          <Image
            source={getImageSource(plant.name)}
            style={styles.plantImage}
          />
  
          {showLuxBadge && (
            <View style={styles.luxContainer}>
              <View style={styles.luxBadge}>
                <Icon name="flash-outline" size={normalize(14)} color="#757575" style={styles.luxIcon} />
                <Text style={styles.luxText}>
                  {`${luxLabel}: ${luxLabel} (${luxValue} lux)`}
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={[styles.plantStandout, styles.italicTagline]}>{plant.tagline}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <View style={styles.infoTile}>
                <Icon name="resize-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                <Text
                  style={styles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {`Up to ${plant.height || 'Unknown height'}`}
                </Text>
              </View>
              <View style={styles.infoTile}>
                <Icon name="water-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                <Text
                  style={styles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {plant.waterRequirement || 'Unknown'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              {matchPercentage !== null && (
                <View style={styles.infoTile}>
                  <Icon name="checkmark-circle-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                  <Text
                    style={styles.infoText}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.9}
                  >
                    {`${matchPercentage}% match`}
                  </Text>
                </View>
              )}
              <View style={styles.infoTile}>
                <Icon name="school-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                <Text
                  style={styles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {(() => {
                    switch (plant.loveLevel?.toLowerCase()) {
                      case 'zero': return 'Easy';
                      case 'some': return 'Medium';
                      case 'lots of': return 'Hard';
                      default: return 'Unknown difficulty';
                    }
                  })()}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoTile}>
                <Icon name="thermometer-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                <Text
                  style={styles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {plant.tempMin && plant.tempMax
                    ? `${plant.tempMin}-${plant.tempMax}°C`
                    : 'Unknown temp'}
                </Text>
              </View>
              <View style={styles.infoTile}>
                <Icon name="paw-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                <Text
                  style={styles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {plant.petsafe
                    ? 'Pet-safe'
                    : plant.petSafetyDetail || 'Not pet-safe'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoTile}>
                <Icon name="heart-outline" size={normalize(16)} color="#757575" style={styles.infoIcon} />
                <Text 
                  style={styles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {plant.loveLanguage || 'Unknown'}
                </Text>
              </View>
            </View>
          </View>

          {showSwipeHint && (
            <View style={styles.swipeHint}>
              <Icon name="arrow-back-outline" size={normalize(14)} color="#757575" style={styles.hintIcon} />
              <Text style={styles.swipeText}>swipe to pass</Text>
              <Text style={styles.separator}> | </Text>
              <Text style={styles.swipeText}>swipe to save</Text>
              <Icon name="arrow-forward-outline" size={normalize(14)} color="#757575" style={styles.hintIcon} />
            </View>
          )}

          {currentIndex !== null && totalPlants !== null && (
            <View style={styles.cardCounter}>
              <Text style={styles.counterText}>
                {currentIndex + 1}/{totalPlants}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
    borderColor: colors.primaryBorder,
  },
  frontSide: {
    flexDirection: 'column',
    padding: normalize(20),
    alignItems: 'center',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    zIndex: 10,
  },
  closeIconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: normalize(30),
    height: normalize(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
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
    backgroundColor: colors.secondaryBg,
    borderRadius: 15,
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(10),
    borderWidth: 1,
    borderColor: colors.primaryBorder,
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
    fontSize: FONT_SIZE.EXTRA_LARGE,
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
    backgroundColor: colors.primaryMedium,
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
    flexShrink: 1,
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
});

export default PlantDetailCard;