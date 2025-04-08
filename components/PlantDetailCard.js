import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getImageSource } from '../utils/imageMap';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY } from '../utils/globalStyles';
import plantCardStyles from '../utils/plantCardStyles.js';

const PlantDetailCard = ({
  plant,
  showLuxBadge = false,
  luxLabel = '',
  luxValue = 0,
  lightLevel = null,
  matchPercentage = null,
  currentIndex = null,
  totalPlants = null,
  showSwipeHint = false,
  showCloseButton = false,
  onClose = null
}) => {
  // Add state for info modal
  const [showSurvivalInfo, setShowSurvivalInfo] = useState(false);
  const [currentInfoTitle, setCurrentInfoTitle] = useState("");
  const [currentInfoMessage, setCurrentInfoMessage] = useState("");

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

  // Determine match badge color and icon
  const getMatchStyle = () => {
    if (matchPercentage === null) return {};

    if (matchPercentage >= 90) {
      // Perfect match - using your primary green
      return {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        iconName: 'checkmark-circle',
        iconColor: colors.textLight,
        textStyle: {
          color: colors.textLight,
          fontSize: FONT_SIZE.SMALL,
          fontFamily: FONT_FAMILY.BOLD
        },
        showAdditionalInfo: false // No info icon needed for perfect match
      };
    } else if (matchPercentage >= 70) {
      // Good match - using your accent lavender color
      return {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
        iconName: null, // No icon for 80% match
        iconColor: colors.textLight,
        textStyle: {
          color: colors.textLight,
          fontSize: FONT_SIZE.SMALL,
          fontFamily: FONT_FAMILY.BOLD
        },
        showAdditionalInfo: true, // Show info icon for 80% match
        infoTitle: "Grows well, but...",
        infoMessage: "This plant likes a bit more light to thrive."
      };
    } else {
      // Survival match - a complementary orange/amber color
      return {
        backgroundColor: '#E57373', // Soft red for survival mode
        borderColor: '#E57373',
        iconName: null, // No icon for 50% match
        iconColor: colors.textLight,
        textStyle: {
          color: colors.textLight,
          fontSize: FONT_SIZE.SMALL,
          fontFamily: FONT_FAMILY.BOLD
        },
        showAdditionalInfo: true, // Show info icon for survival mode
        infoTitle: "Survives, but ...",
        infoMessage: plant?.survivalNote || "This plant may only survive in these light conditions."
      };
    }
  };

  const matchStyle = getMatchStyle();

  return (
    <Animated.View
      style={[
        plantCardStyles.plantCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={plantCardStyles.cardWrapper}>
        <View style={[plantCardStyles.cardSide, plantCardStyles.frontSide]}>
          {/* Close button (included in the animation) */}
          {showCloseButton && onClose && (
            <View style={plantCardStyles.closeButtonContainer}>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={plantCardStyles.closeIconButton}
              >
                <Icon name="close-outline" size={normalize(20)} color="#757575" />
              </TouchableOpacity>
            </View>
          )}

          <View style={plantCardStyles.imageContainer}>
            <Image
              source={getImageSource(plant.name)}
              style={plantCardStyles.plantImage}
            />

            {/* Match percentage badge with icons */}
            {matchPercentage !== null && (
              <View style={[plantCardStyles.matchBadge, { backgroundColor: matchStyle.backgroundColor, borderColor: matchStyle.borderColor }]}>
                {matchStyle.iconName && (
                  <Icon
                    name={matchStyle.iconName}
                    size={normalize(14)}
                    color={matchStyle.iconColor}
                    style={plantCardStyles.matchIcon}
                  />
                )}
                <Text style={[plantCardStyles.matchText, matchStyle.textStyle]}>
                  {`${matchPercentage}%`}
                </Text>
                {matchStyle.showAdditionalInfo && (
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentInfoTitle(matchStyle.infoTitle);
                      setCurrentInfoMessage(matchStyle.infoMessage);
                      setShowSurvivalInfo(!showSurvivalInfo);
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon
                      name="information-circle"
                      size={normalize(14)}
                      color={matchStyle.iconColor}
                      style={plantCardStyles.matchInfoIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <Text style={plantCardStyles.plantName}>{plant.name}</Text>
          <Text style={[plantCardStyles.plantStandout, plantCardStyles.italicTagline]}>{plant.tagline}</Text>

          <View style={plantCardStyles.infoGrid}>
            <View style={plantCardStyles.infoRow}>
              <View style={plantCardStyles.infoTile}>
                <Icon name="resize-outline" size={normalize(16)} color="#757575" style={plantCardStyles.cardIcon} />
                <Text
                  style={plantCardStyles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {`Up to ${plant.height || 'Unknown height'}`}
                </Text>
              </View>
              <View style={plantCardStyles.infoTile}>
                <Icon name="school-outline" size={normalize(16)} color="#757575" style={plantCardStyles.cardIcon} />
                <Text
                  style={plantCardStyles.infoText}
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

            <View style={plantCardStyles.infoRow}>
              <View style={plantCardStyles.infoTile}>
                <Icon name="thermometer-outline" size={normalize(16)} color="#757575" style={plantCardStyles.cardIcon} />
                <Text
                  style={plantCardStyles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {plant.tempMin && plant.tempMax
                    ? `${plant.tempMin}-${plant.tempMax}°C`
                    : 'Unknown temp'}
                </Text>
              </View>
              <View style={plantCardStyles.infoTile}>
                <Icon name="water-outline" size={normalize(16)} color="#757575" style={plantCardStyles.cardIcon} />
                <Text
                  style={plantCardStyles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {plant.waterRequirement || 'Unknown'}
                </Text>
              </View>
            </View>

            <View style={plantCardStyles.infoRow}>
              <View style={plantCardStyles.infoTile}>
                <Icon name="paw-outline" size={normalize(16)} color="#757575" style={plantCardStyles.cardIcon} />
                <Text
                  style={plantCardStyles.infoText}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                >
                  {plant.petsafe
                    ? 'Pet-safe'
                    : plant.petSafetyDetail || 'Not pet-safe'}
                </Text></View>
  <View style={plantCardStyles.infoTile}>
    <Icon name="globe-outline" size={normalize(16)} color="#757575" style={plantCardStyles.cardIcon} />
    <Text
      style={plantCardStyles.infoText}
      numberOfLines={1}
      adjustsFontSizeToFit={true}
      minimumFontScale={0.9}
    >
      {plant.origin || 'Unknown'}
    </Text>
  </View>
</View>
<View style={plantCardStyles.infoRow}>
  <View style={plantCardStyles.infoTile}>
    <Icon name="heart-outline" size={normalize(16)} color="#757575" style={plantCardStyles.cardIcon} />
    <Text
      style={plantCardStyles.infoText}
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
            <View style={plantCardStyles.swipeHint}>
              <Icon name="arrow-back-outline" size={normalize(14)} color="#757575" style={plantCardStyles.hintIcon} />
              <Text style={plantCardStyles.swipeText}>swipe to pass</Text>
              <Text style={plantCardStyles.separator}> | </Text>
              <Text style={plantCardStyles.swipeText}>swipe to save</Text>
              <Icon name="arrow-forward-outline" size={normalize(14)} color="#757575" style={plantCardStyles.hintIcon} />
            </View>
          )}

          {currentIndex !== null && totalPlants !== null && (
            <View style={plantCardStyles.cardCounter}>
              <Text style={plantCardStyles.counterText}>
                {currentIndex + 1}/{totalPlants}
              </Text>
            </View>
          )}

          {/* Info modal (used for both survival mode and grows well) */}
          {showSurvivalInfo && (
            <View style={plantCardStyles.survivalInfoOverlay}>
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={() => setShowSurvivalInfo(false)}
              />
              <View style={[
                plantCardStyles.survivalInfoContainer,
                { 
                  backgroundColor: matchPercentage >= 70 ? '#EFE6FF' : '#FEEEED',
                  borderColor: matchPercentage >= 70 ? colors.accent : '#F5C8C6'
                }
              ]}>
                <View style={plantCardStyles.survivalInfoHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon 
                      name={matchPercentage >= 70 ? "information-circle" : "warning-outline"} 
                      size={normalize(18)} 
                      color={matchPercentage >= 70 ? colors.accent : "#E57373"} 
                      style={plantCardStyles.survivalIcon} 
                    />
                    <Text style={[
                      plantCardStyles.survivalLabel, 
                      { color: matchPercentage >= 70 ? colors.accent : "#E57373" }
                    ]}>
                      {currentInfoTitle}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowSurvivalInfo(false)}>
                    <Icon name="close-outline" size={normalize(18)} color="#757575" />
                  </TouchableOpacity>
                </View>
                <Text style={plantCardStyles.survivalNote}>{currentInfoMessage}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default PlantDetailCard;