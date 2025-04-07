// utils/globalStyles.js
import { StyleSheet, StatusBar, Dimensions } from 'react-native';
import { normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, LINE_HEIGHT } from './fontScaling';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Calculate the header height to use consistently throughout the app
const HEADER_HEIGHT = StatusBar.currentHeight + normalize(65);

// App colors - Enhanced color system
const colors = {
  // Primary color palette (green)
  primary: '#425f29',        // Main green
  primaryMedium: 'rgba(66, 95, 41, 0.1)', // 10% opacity green for dropdowns
  
  // Accent color palette (lavender)
  accent: '#9D8AC7',         // Lavender accent
  accentMedium: 'rgba(157, 138, 199, 0.3)', // 30% opacity lavender for borders/hover states
  accentDark: '#8677AB',     // Darker lavender for pressed states
  
  // Text colors
  textDark: '#757575',       // Dark text
  textLight: '#FFFFFF',      // Light text
  textPrimary: '#425f29',    // Primary green text
  textHeader: '#425f29',     // Header text (slightly different green)
  textDisabled: '#B0B0B0',   // Disabled text
  
  // Background colors
  primaryBg: '#ECF7E6',   // Lighter green for app background
  secondaryBg: '#FFFFFF',     // Background white
  inputBg: '#F5F5F5',    // Background light gray
  
  // Border colors
  primaryBorder: 'rgba(66, 95, 41, 0.35)', // Border green
  secundaryBorder: '#CCCCCC',     // Default card border
};

// Typography styles - centralized for consistent use across the app
const typography = {
  title: {
    fontSize: FONT_SIZE.HEADER,
    fontFamily: FONT_FAMILY.EXTRA_BOLD,
    fontWeight: FONT_WEIGHT.EXTRA_BOLD,
    color: colors.textHeader,
    letterSpacing: 0.5,
  },
  
  subtitle: {
    fontSize: FONT_SIZE.LARGE,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textPrimary,
  },
  
  body: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    lineHeight: LINE_HEIGHT.MEDIUM,
    color: colors.textDark,
  },
  
  button: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textLight,
  },
  
  count: {
    fontSize: FONT_SIZE.COUNT,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textLight,
  },
};

const globalStyles = StyleSheet.create({
  // Core container
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
    paddingTop: HEADER_HEIGHT, 
  },

  // Scroll container
  scrollContainer: { 
    flex: 1,
  },
  
  // Content wrapper for body on Home and NerdMode
  contentWrapper: {
    width: '85%',
    alignSelf: 'center',
    paddingTop: normalize(15), 
  },

  // Header section
  headerSection: {
    paddingTop: StatusBar.currentHeight + normalize(15),
    paddingBottom: normalize(15),
    paddingHorizontal: 0,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    elevation: 0, 
    height: HEADER_HEIGHT, 
  },

  title: {
    ...typography.title,
    width: '85%',
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: normalize(2),
  },
  
  headerLeftButton: {
    width: normalize(36),
    height: normalize(36),
    backgroundColor: colors.secondaryBg, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: normalize(15), // Combine margins
  },
  headerRightButtonEmpty: {
    marginHorizontal: normalize(10),
    paddingVertical: 0,
    width: normalize(36), 
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: normalize(36),
  },

// Body section Favorites and About

  bodySection: {
    flex: 1,
    paddingHorizontal: normalize(10),
  },
});

export default globalStyles;
export { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, LINE_HEIGHT, typography };