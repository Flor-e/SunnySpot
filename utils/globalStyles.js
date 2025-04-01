// utils/globalStyles.js
import { StyleSheet, StatusBar } from 'react-native';

// Calculate the header height to use consistently throughout the app
const HEADER_HEIGHT = StatusBar.currentHeight + 66; 

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
  
  // Background colors
  background: '#FFFFFF',     // Background white
  secondaryBg: '#F5F5F5',    // Secondary background (light gray)
  
  // Border colors
  cardBorder: '#CCCCCC',     // Default card border
  inputBorder: '#97B598',    // Input field border
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
    paddingTop: 15, 
  },
  // Header section
  headerSection: {
    backgroundColor: colors.secondaryBg,
    paddingTop: StatusBar.currentHeight + 15,
    paddingBottom: 15,
    paddingHorizontal: 0,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    elevation: 2, 
    height: StatusBar.currentHeight + 66, 
  },
  // Header icon button - UPDATED for active state with accent
  headerIconButton: {
    width: 36,
    height: 36,
    backgroundColor: colors.background, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 15,
  },
  headerIconButtonActive: {
    backgroundColor: colors.primary, 
    borderColor: colors.primary, 
  },
  // Optional body section
  bodySection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Text styles
  fontRegular: { fontFamily: 'NunitoSans' },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.textHeader,
    width: '85%',
    alignSelf: 'center',
    letterSpacing: 0.5,
    textAlign: 'center',
    fontFamily: 'NunitoSansExtraBold',
    paddingBottom: 2,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
    width: '85%',
    alignSelf: 'center',
    fontFamily: 'NunitoSans',
    paddingBottom: 15,
    paddingTop: 15,
  },
  buttonText: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '600',
    fontFamily: 'NunitoSansBold',
  },
  plantName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textHeader,
    fontFamily: 'NunitoSansBold',
    maxWidth: 155,
  },
  standout: {
    fontSize: 12,
    fontFamily: 'NunitoSansRegular',
    color: colors.textDark,
    marginBottom: 3,
  },
  // Title style for nerdCard
  nerdCardTitle: {
    fontSize: 18,
    fontFamily: 'NunitoSansBold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 5,
  },
  // Body text style for nerdCard (lightLevelText)
  nerdCardBodyText: {
    fontSize: 16,
    fontFamily: 'NunitoSansRegular',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 30,
  },
  // Button and modal styles
  measureButton: {
    backgroundColor: colors.primary,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginTop: 20,
  },
  disabledMeasureButton: {
    backgroundColor: colors.textPrimary,
  },
  buttonLabel: {
    fontSize: 20,
    fontFamily: 'NunitoSansBold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginVertical: 15,
  },
  countdownText: {
    fontSize: 50,
    fontFamily: 'NunitoSansBold',
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    width: '90%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalScroll: {
    width: '100%',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'NunitoSansBold',
    color: colors.textHeader,
    marginBottom: 15,
    textAlign: 'center',
  },
  // New style for accent header in modals
  modalTitleContainer: {
    backgroundColor: colors.accentLight,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accentMedium,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'NunitoSansRegular',
    color: colors.textDark,
    lineHeight: 24,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  modalBoldText: {
    fontFamily: 'NunitoSansBold',
    color: colors.textHeader,
  },
  // Primary and secondary action buttons
  modalClose: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
    marginTop: 10,
  },
  modalPositiveButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    marginTop: 10,
  },
  // Updated secondary button with accent
  modalNegativeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.accentDark,
  },
  // Card styles
  cardTile: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginVertical: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 8,
  },
  favCard: {
    width: '47%',
    backgroundColor: colors.background,
    borderRadius: 12,
    margin: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 8,
    position: 'relative',
  },
  nerdCard: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    marginVertical: 15,
    marginHorizontal: 0,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 15,
    paddingBottom: 20,
    position: 'relative',
  },
  // Container for nerdCard content
  nerdCardContent: {
    paddingHorizontal: 5,
  },
  // Container for nerdCard title
  nerdCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  // Container for plant profile filter dropdowns
  plantProfileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  // Bin icon for nerdCard
  binIcon: {
    position: 'absolute',
    top: 18,
    right: 70,
  },
  imageContainer: {
    width: '100%',
    height: 100,
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
    paddingTop: 8,
    alignItems: 'center',
  },
  heartIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 3,
  },
  // Plant Profile (Filter Dropdowns)
  filterDropdown: {
    marginHorizontal: 2,
    marginTop: 2,
    borderBottomWidth: 2,
    borderBottomColor: colors.textPrimary,
    backgroundColor: colors.primaryLighter,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 7,
    height: 26,
  },
  filterDropdownText: {
    fontSize: 16,
    fontFamily: 'NunitoSansRegular',
    color: colors.textPrimary,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 5,
  },
  chevronIcon: {
    alignSelf: 'center',
    marginRight: 5,
  },
  // Bottom Section for Measurement Button
  bottomSection: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  // Lux Display Styles
  luxDisplay: {
    alignItems: 'center',
    marginBottom: 60,
  },
  luxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  luxText: {
    fontSize: 16,
    fontFamily: 'NunitoSansRegular',
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginRight: 3,
  },
  lightLevelText: {
    fontSize: 14,
    fontFamily: 'NunitoSansRegular',
    color: colors.textDark,
    marginTop: 2,
  },
  // Instruction Panel
  instructionPanel: {
    position: 'absolute',
    top: StatusBar.currentHeight + 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 20,
  },
  instructionPanelTitle: {
    fontSize: 18,
    fontFamily: 'NunitoSansBold',
    color: colors.textHeader,
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionPanelText: {
    fontSize: 16,
    fontFamily: 'NunitoSansRegular',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
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
    marginVertical: 3,
  },
  profileLabel: {
    fontSize: 16,
    fontFamily: 'NunitoSansRegular',
    color: colors.textDark,
  },
  profileText: {
    fontSize: 16,
    fontFamily: 'NunitoSansRegular',
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  // Updated with accent styling
  highlightText: {
    fontSize: 16,
    fontFamily: 'NunitoSansBold',
    color: colors.accent,
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

  subtitleBadge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.accentMedium,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: 'NunitoSansBold',
    color: colors.textLight,
  },
  
  // Flexible story flow container
  plantProfileStoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 3,
  },
  storyText: {
    fontSize: 16,
    fontFamily: 'NunitoSansRegular',
    color: colors.textDark,
    marginVertical: 2,
  },
  storyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLighter,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    marginVertical: 2,
  },
  storyButtonAlt: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accentMedium,
  },
  // Clear filters button
  clearButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.background,
  },
  clearButtonIcon: {
    marginRight: 5,
  },
  clearButtonText: {
    fontSize: 12,
    fontFamily: 'NunitoSansRegular',
    color: colors.textPrimary, 
  },
  // Active state for buttons
  activeStoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  storyButtonIcon: {
    marginRight: 6,
  },
  storyButtonLabel: {
    fontSize: 14,
    fontFamily: 'NunitoSansBold',
    color: colors.textPrimary,
  },
  storyButtonLabelAlt: {
    color: colors.accent,
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
    marginVertical: 5,
  },
  statNumber: {
    fontSize: 16,
    fontFamily: 'NunitoSansBold',
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
    marginTop: 15,
    gap: 15,
  },
  logbookActionButton: { 
    backgroundColor: colors.accent, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
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
    marginRight: 6,
  },
  logbookButtonText: { 
    fontSize: 14,
    fontFamily: 'NunitoSansBold', 
    color: colors.textLight,
  },
  // Navigation styles
  chevronToggle: {
    backgroundColor: colors.accent,
    width: 25,
    height: 25,
    borderRadius: 15,
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
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: colors.accentLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentMedium,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  snackbarText: {
    fontSize: 14,
    fontFamily: 'NunitoSansRegular',
    color: colors.textDark,
  },
  snackbarAction: {
    fontSize: 14,
    fontFamily: 'NunitoSansBold',
    color: colors.accent,
  },
  // Bottom navigation dots
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  navDotAlt: {
    backgroundColor: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: colors.accentMedium,
    width: '80%',
    alignSelf: 'center',
  },
});

export default globalStyles;
export { colors };