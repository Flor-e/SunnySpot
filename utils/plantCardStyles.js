// utils/plantCardStyles.js
import { StyleSheet } from 'react-native';
import { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from './globalStyles';

const plantCardStyles = StyleSheet.create({
// Plant Advice modal
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
  luxBadgeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  luxBadge: {
    backgroundColor: colors.primaryBg,
    borderRadius: 15,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(12),
    marginBottom: normalize(10),
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
  cardContainer: {
    width: '100%',
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMorePlants: {
    alignItems: 'center',
    width: '85%',
    backgroundColor: colors.primaryBg,
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
    textAlign: 'center',
  },
  noMatchExplanation: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: normalize(20),
    paddingHorizontal: normalize(10),
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

// Plant detail card styles
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
  backgroundColor: colors.primaryBg,
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
imageContainer: {
  position: 'relative',
  width: '100%',
  marginBottom: normalize(15),
},
plantImage: {
  width: '100%',
  height: normalize(200),
  resizeMode: 'cover',
  borderRadius: 10,
},
matchBadge: {
  position: 'absolute',
  bottom: normalize(8),
  right: normalize(8),
  paddingVertical: normalize(4),
  paddingHorizontal: normalize(10), // Increased horizontal padding
  borderRadius: 12,
  borderWidth: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // Add this to center the content
  },
matchIcon: {
  marginRight: normalize(4),
  },
matchText: {
  fontSize: FONT_SIZE.SMALL,
  fontFamily: FONT_FAMILY.BOLD,
  marginHorizontal: normalize(4), // Add equal spacing on both sides
  },
matchInfoIcon: {
  marginLeft: normalize(4), // Use marginLeft instead of marginRight
  },
matchText: {
  fontSize: FONT_SIZE.SMALL,
  fontFamily: FONT_FAMILY.BOLD,
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
cardIcon: {
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
  // New styles for survival mode
  survivalInfoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  survivalInfoContainer: {
    width: '85%',
    backgroundColor: '#FEEEED',
    borderRadius: 12,
    padding: normalize(16),
    borderWidth: 1,
    borderColor: '#F5C8C6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  survivalInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  survivalContainer: {
    width: '100%',
    backgroundColor: '#FEEEED',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F5C8C6',
    padding: normalize(10),
    marginBottom: normalize(15),
  },
  survivalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(5),
  },
  survivalIcon: {
    marginRight: normalize(6),
  },
  survivalLabel: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.BOLD,
    color: '#E57373',
  },
  survivalNote: {
    fontSize: FONT_SIZE.SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#757575',
    lineHeight: normalize(18),
  },

});    

export default plantCardStyles;