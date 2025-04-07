// utils/favoriteCardStyles.js
import { StyleSheet } from 'react-native';
import { normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from './fontScaling';
import { colors, typography } from './globalStyles';

const favoriteCardStyles = StyleSheet.create({
  // Card styles
  favCard: {
    width: '47%',
    backgroundColor: colors.secondaryBg,
    borderRadius: 12,
    margin: normalize(8),
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    padding: normalize(5),
    position: 'relative',
  },
  
  imageContainer: {
    width: '100%',
    height: normalize(100),
  },
  
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  
  cardInfo: {
    flex: 1,
    paddingTop: normalize(8),
    alignItems: 'center',
  },
  
  heartIcon: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
    borderRadius: normalize(15), // Make it circular
    width: normalize(30),
    height: normalize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Text styles
  plantName: {
    fontSize: normalize(15),
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textHeader,
    maxWidth: normalize(155),
  },
  
  standout: {
    fontSize: FONT_SIZE.SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
    marginBottom: normalize(3),
  },
  
  // Page styles
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
    color: colors.textDark,
    textAlign: 'center',
    padding: normalize(20),
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
  
  // Snackbar styles
  snackbar: {
    position: 'absolute',
    bottom: normalize(80),
    left: normalize(20),
    right: normalize(20),
    backgroundColor: colors.inputBg,
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
    color: colors.textDark,
  },
  
  undoText: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.BOLD,
    color: colors.primary,
  },
});

export default favoriteCardStyles;