// utils/measureSectionStyles.js
import { StyleSheet } from 'react-native';
import { normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from './fontScaling';
import { colors, typography } from './globalStyles';

const measureSectionStyles = StyleSheet.create({
    bottomSection: {
        position: 'absolute',
        bottom: normalize(30),
        left: 0,
        right: 0,
        alignItems: 'center',
      },
    
      // Measure button styles
      measureButton: {
        backgroundColor: colors.primary,
        width: normalize(120),
        height: normalize(120),
        borderRadius: normalize(60),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        marginTop: normalize(20),
      },
      
      disabledMeasureButton: {
        backgroundColor: '#B0B0B0',
      },
      
      buttonSubtitle: {
        fontSize: FONT_SIZE.EXTRA_LARGE,
        fontFamily: FONT_FAMILY.BOLD,
        color: colors.textPrimary,
        textAlign: 'center',
        marginTop: normalize(15),
      },
      countdownText: {
        ...typography.count,
      },
      
      // Help button
      helpButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
      helpBadge: {
        marginTop: normalize(5),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(5),
        backgroundColor: colors.accent,
        borderRadius: normalize(8),
      },
      helpBadgeText: {
        color: '#FFFFFF',
        fontSize: normalize(12),
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: FONT_WEIGHT.BOLD,
      },

      // Lux Display Styles
        luxDisplay: {
          alignItems: 'center',
          marginBottom: normalize(60),
          marginTop: normalize(20)
        },
        
        luxRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        
        luxText: {
          fontSize: FONT_SIZE.REGULAR,
          fontFamily: FONT_FAMILY.REGULAR,
          fontWeight: FONT_WEIGHT.BOLD,
          color: colors.textPrimary,
          marginRight: normalize(3),
        },
        
        lightLevelText: {
          fontSize: FONT_SIZE.MEDIUM,
          fontFamily: FONT_FAMILY.REGULAR,
          color: colors.textDark,
          marginTop: normalize(2),
        },

      // Styles for light sensor hint
      lightSensorHint: {
        backgroundColor: colors.primaryMedium,
        borderRadius: 10,
        padding: normalize(10),
        marginHorizontal: normalize(10),
        marginBottom: normalize(385),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'relative',
        width: '85%',
      },
      lightSensorHintText: {
        flex: 1,
        fontSize: FONT_SIZE.MEDIUM,
        fontFamily: FONT_FAMILY.REGULAR,
        color: colors.textPrimary,
        padding: normalize(3),
        marginRight: normalize(10),
      },
      lightSensorHintCloseButton: {
        position: 'absolute',
        top: normalize(4),
        right: normalize(4),
      },
    });

export default measureSectionStyles;