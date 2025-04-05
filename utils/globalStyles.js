// utils/globalStyles.js
import { StyleSheet, StatusBar, Dimensions } from 'react-native';
import { normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, LINE_HEIGHT } from './fontScaling';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Calculate the header height to use consistently throughout the app
const HEADER_HEIGHT = StatusBar.currentHeight + normalize(66);

// App colors - Enhanced color system
const colors = {
  // Primary color palette (green)
  primary: '#425f29',        // Main green
  primaryLight: '#91a65f',   // Lighter green
  primaryLighter: 'rgba(66, 95, 41, 0.05)', // Very light green background
  primaryBorder: 'rgba(66, 95, 41, 0.2)', // Border green
  
  // Accent color palette (lavender)
  accent: '#9D8AC7',         // Lavender accent
  accentLight: 'rgba(157, 138, 199, 0.1)', // 10% opacity lavender for backgrounds
  accentMedium: 'rgba(157, 138, 199, 0.3)', // 30% opacity lavender for borders/hover states
  accentDark: '#8677AB',     // Darker lavender for pressed states
  
  // Text colors
  textDark: '#757575',       // Dark text
  textLight: '#FFFFFF',      // Light text
  textPrimary: '#425f29',    // Primary green text
  textHeader: '#425f29',     // Header text (slightly different green)
  textDisabled: '#B0B0B0',   // Disabled text
  
  // Background colors
  background: '#FFFFFF',     // Background white
  secondaryBg: '#F5F5F5',    // Secondary background (light gray)
  
  // Border colors
  cardBorder: '#CCCCCC',     // Default card border
  inputBorder: '#97B598',    // Input field border
};

// Typography styles - centralized for consistent use across the app
const typography = {
  // Base text styles
  baseText: {
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
  },
  
  // Font sizes
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
  
  caption: {
    fontSize: FONT_SIZE.SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
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
    backgroundColor: colors.background,
    paddingTop: HEADER_HEIGHT, 
  },
  
  // Content wrapper for body on Home and NerdMode
  contentWrapper: {
    width: '85%',
    alignSelf: 'center',
    paddingTop: normalize(15), 
  },
  
  // Header section
  headerSection: {
    backgroundColor: colors.secondaryBg,
    paddingTop: StatusBar.currentHeight + normalize(15),
    paddingBottom: normalize(15),
    paddingHorizontal: 0,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    elevation: 2, 
    height: HEADER_HEIGHT, 
  },
  
  // Header icon button - UPDATED for active state with accent
  headerIconButton: {
    width: normalize(36),
    height: normalize(36),
    backgroundColor: colors.background, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
    marginLeft: normalize(15),
  },
  
  // Optional body section
  bodySection: {
    flex: 1,
    paddingHorizontal: normalize(20),
    paddingTop: normalize(20),
  },
  
  // Text styles
  fontRegular: { 
    fontFamily: FONT_FAMILY.REGULAR 
  },
  
  title: {
    ...typography.title,
    width: '85%',
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: normalize(2),
  },
  
  instructionText: {
    ...typography.body,
    textAlign: 'center',
    width: '85%',
    alignSelf: 'center',
    paddingBottom: normalize(15),
    paddingTop: normalize(15),
  },
  
  buttonText: {
    ...typography.button,
  },
  
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
  
  // Title style for nerdCard
  nerdCardTitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: normalize(2),
  },
  
  // Body text style for nerdCard (lightLevelText)
  nerdCardBodyText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.MEDIUM,
  },
  
  // Button and modal styles
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
    backgroundColor: colors.textPrimary,
  },
  
  buttonLabel: {
    fontSize: FONT_SIZE.EXTRA_LARGE,
    fontFamily: FONT_FAMILY.BOLD,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: normalize(15),
  },
  
  countdownText: {
    ...typography.count,
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalBox: {
    width: '85%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: normalize(20),
    alignItems: 'center',
    maxHeight: '100%',
  },
  
  modalScroll: {
    width: '100%',
    marginBottom: normalize(15),
  },
  
  modalTitle: {
    ...typography.subtitle,
    marginBottom: normalize(15),
    textAlign: 'center',
  },
  
  // New style for accent header in modals
  modalTitleContainer: {
    backgroundColor: colors.accentLight,
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(15),
    borderRadius: 8,
    marginBottom: normalize(15),
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accentMedium,
  },
  
  // Modal Text - UPDATED with consistent font styling
  modalText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
    paddingHorizontal: normalize(10),
    marginVertical: normalize(5),
  },
  
  modalBoldText: {
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textHeader,
  },
  
  // Primary and secondary action buttons
  modalClose: {
    backgroundColor: colors.primary,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(15),
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
    marginTop: normalize(10),
  },
  
  modalPositiveButton: {
    backgroundColor: colors.accent,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(15),
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    marginTop: normalize(10),
  },
  
  // Updated secondary button with accent
  modalNegativeButton: {
    backgroundColor: colors.primary,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(15),
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    marginTop: normalize(10),
  },
  
  // Card styles
  cardTile: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginVertical: normalize(5),
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: normalize(8),
  },
  
  favCard: {
    width: '47%',
    backgroundColor: colors.background,
    borderRadius: 12,
    margin: normalize(5),
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: normalize(8),
    position: 'relative',
  },
  
  nerdCard: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    margin: normalize(15),
    padding: normalize(15),
    paddingVertical: normalize(15),
    position: 'relative',
    alignSelf: 'center',
  },
  
  // Container for nerdCard content
  nerdCardContent: {
    paddingHorizontal: normalize(5),
  },
  
  // Container for nerdCard title
  nerdCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(5),
  },
  
  // Container for plant profile filter dropdowns
  plantProfileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(10),
  },
  
  // Bin icon for nerdCard
  binIcon: {
    position: 'absolute',
    top: normalize(18),
    right: normalize(70),
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
  
  // Plant Profile (Filter Dropdowns)
  filterDropdown: {
    marginHorizontal: normalize(2),
    marginTop: normalize(2),
    borderBottomWidth: 2,
    borderBottomColor: colors.textPrimary,
    backgroundColor: colors.primaryLighter,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(7),
    height: normalize(26),
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
  
  // Bottom Section for Measurement Button
  bottomSection: {
    position: 'absolute',
    bottom: normalize(30),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  
  // Lux Display Styles
  luxDisplay: {
    alignItems: 'center',
    marginBottom: normalize(50),
    marginTop: normalize(15)
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
  
  // Instruction Panel
  instructionPanel: {
    position: 'absolute',
    top: StatusBar.currentHeight + 0,
    left: 0,
    right: 0,
    padding: normalize(20),
    paddingBottom: normalize(20),
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 20,
    hadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Increases the bottom shadow
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Lower elevation for a subtler effect
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder, 
    },
  
  instructionPanelTitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  
  instructionPanelText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  
  // General utility styles
  alignItemsCenter: {
    alignItems: 'center',
  },
  
  flexRow: {
    flexDirection: 'row',
  },
  
  // New styles for plant profile
  profileLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: normalize(3),
  },
  
  profileLabel: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
  },
  
  profileText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textPrimary,
  },
  
  // Updated with accent styling
  highlightText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.accent,
  },
  
  cardBorder: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
  
  // Flexible story flow container
  plantProfileStoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(12),
    marginTop: normalize(10),
    gap: 3,
  },
  
  storyText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
    marginVertical: normalize(2),
  },
  
  storyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLighter,
    borderRadius: 6,
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(6),
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    marginVertical: normalize(2),
  },
  
  storyButtonAlt: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accentMedium,
  },
  
  // Clear filters button
  clearButtonContainer: {
    alignItems: 'center',
    marginTop: normalize(10),
  },
  
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(8),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.background,
  },
  
  clearButtonIcon: {
    marginRight: normalize(5),
  },
  
  clearButtonText: {
    fontSize: FONT_SIZE.SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textPrimary, 
  },
  
  // Active state for buttons
  activeStoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  storyButtonIcon: {
    marginRight: normalize(6),
  },
  
  storyButtonLabel: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textPrimary,
  },
  
  activeStoryButtonLabel: {
    color: colors.textLight,
  },
  
  // Light logbook styles
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: normalize(5),
  },
  
  statNumber: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.accent,
  },
  
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
  
  logbookButtonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: normalize(15),
    gap: normalize(15),
  },
  
  logbookActionButton: { 
    backgroundColor: colors.accent, 
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderRadius: 8,
    minWidth: normalize(120),
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
  
  // Navigation styles
  chevronToggle: {
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
  },
  
  // Snackbar notification
  snackbar: {
    position: 'absolute',
    bottom: normalize(80),
    left: normalize(20),
    right: normalize(20),
    backgroundColor: colors.accentLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentMedium,
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
  
  snackbarAction: {
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.accent,
  },
  
  // Bottom navigation dots
  navDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: colors.primary,
    marginHorizontal: normalize(4),
  },
  
  divider: {
    height: 1,
    backgroundColor: colors.accentMedium,
    width: '80%',
    alignSelf: 'center',
  },
});

export default globalStyles;
export { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, LINE_HEIGHT, typography };