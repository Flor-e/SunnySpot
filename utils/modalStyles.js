// utils/modalStyles.js
import { StyleSheet } from 'react-native';
import { normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from './fontScaling';
import { colors, typography } from './globalStyles';

const modalStyles = StyleSheet.create({
 // Modal styles
  
 modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    width: '85%',
    backgroundColor: colors.secondaryBg,
    borderRadius: 12,
    padding: normalize(20),
    alignItems: 'center',
    maxHeight: '100%',
    backgroundColor: colors.primaryBg,
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

  // Modal Text
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

  // Modal action buttons
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
    modalNegativeButton: {
      backgroundColor: colors.primary,
      paddingVertical: normalize(12),
      paddingHorizontal: normalize(15),
      borderRadius: 8,
      alignItems: 'center',
      width: '40%',
      marginTop: normalize(10),
    },
    buttonText: {
        ...typography.button,
    },
});

export default modalStyles;