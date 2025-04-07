// utils/searchScreenStyles.js
import { StyleSheet } from 'react-native';
import { normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from './fontScaling';
import { colors, typography } from './globalStyles';

const searchScreenStyles = StyleSheet.create({    
    
    // Intro section styles
    introSection: {
        backgroundColor: colors.primaryMedium,
        borderRadius: 10,
        paddingBottom: normalize(10),
        marginBottom: normalize(10),
        alignItems: 'center',
        alignSelf: 'center',
        width: '85%',
    },

    introText: {
        width: '80%',
        textAlign: 'center',
        color: colors.textPrimary,
    },

    linkText: {
        color: colors.textPrimary,
        textDecorationLine: 'underline'
    },

    // Search component styles    
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.inputBg,
        borderRadius: 8,
        paddingHorizontal: normalize(10),
        marginBottom: normalize(20),
        marginTop: normalize(20),
        borderWidth: 1,
        borderColor: colors.primaryBorder,
        width: '75%',
        alignSelf: 'center'
    },

    searchIcon: {
        marginRight: normalize(8),
    },

    searchInput: {
        flex: 1,
        height: normalize(40),
        fontSize: FONT_SIZE.REGULAR,
        color: '#000000',
        fontFamily: FONT_FAMILY.REGULAR,
    },

    // Results list styles
    resultsList: {
        flex: 1,
        width: '85%',
        alignSelf: 'center'
    },

    noResultsText: {
        width: '85%',
        alignSelf: 'center'
    },

    // Card styles
    cardTile: {
        backgroundColor: colors.secondaryBg,  // This gives the white background
        borderRadius: 12,
        marginVertical: normalize(5),
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.primaryBorder,
        padding: normalize(8),
      },
    
    horizontalCardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: 'auto',
    },

    cardImage: {
        width: normalize(80),
        height: normalize(60),
        borderRadius: 8,
        marginRight: normalize(2),
    },

    cardTextContainer: {
        flex: 1,
        marginLeft: normalize(10),
        justifyContent: 'flex-start',
    },

    spacingView: {
        paddingTop: normalize(5)
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
    instructionText: {
        ...typography.body,
        textAlign: 'center',
        width: '85%',
        alignSelf: 'center',
        paddingBottom: normalize(15),
        paddingTop: normalize(15),
      },
});

export default searchScreenStyles;