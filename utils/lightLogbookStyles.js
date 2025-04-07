// utils/lightLogbookStyles.js
import { StyleSheet } from 'react-native';
import { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from './globalStyles';

const lightLogbookStyles = StyleSheet.create({
  // Container styles
  container: {
    width: '100%',
    borderRadius: 12,
    padding: normalize(15),
    position: 'relative',
    alignSelf: 'center',
  },
  
  cardContainer: {
    position: 'relative',
  },
  
  // Header styles
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(5),
  },
  
  cardTitle: {
    fontSize: FONT_SIZE.LARGE,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: normalize(2),
  },
  
  subtitleBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(10),
    alignSelf: 'center',
    marginBottom: normalize(10),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  badgeText: {
    fontSize: FONT_SIZE.SMALL,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textLight,
  },
  
  // Logbook dropdown styles
  logbookDropdown: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: normalize(170),
    height: normalize(36),
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(6),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filterDropdownText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textPrimary,
    alignSelf: 'center',
    marginLeft: normalize(5),
  },
  chevronIcon: {
    alignSelf: 'center',
    marginRight: normalize(5),
  },
  createButton: {
  width: normalize(40),
  height: normalize(36),
  borderTopRightRadius: 8,
  borderBottomRightRadius: 8,
  backgroundColor: colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: -2,
  },
  
  // Content styles
  contentContainer: {
    paddingHorizontal: normalize(5),
  },
  
  // Information display
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: normalize(5),
  },
  
  highlightedText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textPrimary,
  },
  
  storyText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
    marginVertical: normalize(2),
  },

  // Information panel
  bodyText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: normalize(10),
  },
  
  // Divider styles
  dividerContainer: {
    paddingVertical: normalize(15),
  },
  
  divider: {
    height: 1,
    backgroundColor: colors.accentMedium,
    width: '80%',
    alignSelf: 'center',
  },
  
  // Measurement display
  lastMeasurementLabelContainer: {
    width: '100%',
    alignItems: 'center',
  },
  
  lastMeasurementValueContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Button styles
  logbookButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(20),
    gap: normalize(15),
  },
  
  logbookActionButton: {
    backgroundColor: colors.accent,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderRadius: 8,
    width: '40%',
  },
  
  logbookActionButtonSecondary: {
    backgroundColor: colors.primary,
  },
  
  logbookDisabledButton: {
    backgroundColor: '#B0B0B0',
  },
  
  logbookButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logbookButtonIcon: {
    marginRight: normalize(6),
  },
  
  logbookButtonText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textLight,
  },
  
  // Toggle and action icons
  binIcon: {
    marginLeft: normalize(8),
    marginBottom: normalize(1),
  },
  
  toggleChevron: {
    position: 'absolute',
    right: normalize(0),
    top: '55%',
    transform: [{ translateY: normalize(-12) }],
    backgroundColor: colors.accent,
    width: normalize(25),
    height: normalize(25),
    borderRadius: normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10
  },
});

export default lightLogbookStyles;