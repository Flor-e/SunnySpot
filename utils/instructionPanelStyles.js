// utils/instructionPanelStyles.js
import { StyleSheet, StatusBar } from 'react-native';
import { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, typography } from './globalStyles';

const instructionPanelStyles = StyleSheet.create({
    instructionPanel: {
        position: 'absolute',
        top: StatusBar.currentHeight + 0,
        left: 0,
        right: 0,
        padding: normalize(20),
        paddingBottom: normalize(20),
        alignItems: 'center',
        backgroundColor: colors.secondaryBg,
        zIndex: 20,
        hadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Increases the bottom shadow
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2, // Lower elevation for a subtler effect
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.primaryBorder, 
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
});

export default instructionPanelStyles;