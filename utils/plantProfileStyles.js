// utils/plantProfileStyles.js
import { StyleSheet } from 'react-native';
import { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from './globalStyles';

const plantProfileStyles = StyleSheet.create({
  // Container styles
  container: {
    width: '100%',
    borderRadius: 12,
    padding: normalize(15),
    position: 'relative',
    alignSelf: 'center',
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
  
  // Content styles
  contentContainer: {
    paddingHorizontal: normalize(5),
  },
  
  // Story flow container
  storyContainer: {
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
    backgroundColor: colors.primaryMedium,
    borderRadius: 6,
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(6),
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    marginVertical: normalize(2),
  },
  
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
  
  // Clear filters button
  clearButtonContainer: {
    alignItems: 'center',
    marginTop: normalize(15),
  },
  
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(8),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  
  clearButtonIcon: {
    marginRight: normalize(5),
  },
  
  clearButtonText: {
    fontSize: FONT_SIZE.SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textPrimary, 
  },
});

export default plantProfileStyles;