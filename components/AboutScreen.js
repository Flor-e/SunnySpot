import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, ScrollView, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { plantsData } from '../utils/plantAdvice';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, typography } from '../utils/globalStyles';
import { getImageSource } from '../utils/imageMap';
import { Linking } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const AboutScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPlants([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = plantsData.filter((plant) => plant.name.toLowerCase().includes(lowerQuery));
    setFilteredPlants(results);
  };

  const openPlantModal = (plant) => {
    setSelectedPlant(plant);
    setModalVisible(true);
  };

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity onPress={() => openPlantModal(item)} style={[globalStyles.cardTile, styles.horizontalCardContainer]}>
      <Image
        source={getImageSource(item.name)}
        style={styles.cardImage}
        resizeMode="contain"
        onError={(e) => console.log(`Image load error for ${item.name}:`, e.nativeEvent.error)}
      />
      <View style={styles.cardTextContainer}>
        <Text style={globalStyles.plantName}>{item.name}</Text>
        <Text style={globalStyles.standout}>{item.tagline}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header Section */}
      <View style={[globalStyles.headerSection, styles.headerSection]}>
        <Text style={globalStyles.title}>Search plant database</Text>
      </View>
  
      <View style={{ paddingTop: normalize(20) }} />
  
      {/* Intro Section */}
      <View style={styles.introSection}>
      <Text style={[globalStyles.instructionText, styles.introText]}>
        I hope you found the perfect plant for your spot! This app was made with love by me (
      <Text
       style={{ color: colors.textPrimary, textDecorationLine: 'underline' }}
        onPress={() => Linking.openURL('https://www.x.com/lavie_flori')}
      >
         @Lavie_Flori
      </Text>
        ) and coded by AI (Grok 2 and Claude 3.7). Grok also created all of the plant artwork.
      </Text>
      </View>

      {/* Body Section */}
      <View style={globalStyles.bodySection}>
        <View style={[styles.searchContainer, { width: '85%', alignSelf: 'center' }]}>
          <Icon name="search-outline" size={normalize(20)} color="#757575" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, globalStyles.fontRegular]}
            placeholder="Search plants..."
            placeholderTextColor="#757575"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        {searchQuery.trim() === '' ? (
          <Text style={[globalStyles.instructionText, { width: '85%', alignSelf: 'center' }]} />
        ) : filteredPlants.length > 0 ? (
          <FlatList
            data={filteredPlants}
            renderItem={renderPlantItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            style={[styles.resultsList, { width: '85%', alignSelf: 'center' }]}
            contentContainerStyle={{ paddingBottom: normalize(80) }}
          />
        ) : (
          <Text style={[globalStyles.instructionText, { width: '85%', alignSelf: 'center' }]}>
            No plants found matching "{searchQuery}".
          </Text>
        )}
      </View>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={globalStyles.modalOverlay}>
          <View style={[globalStyles.modalBox, styles.modalContainer]}>
            <ScrollView contentContainerStyle={styles.scrollContent} style={{ width: '100%' }}>
              {selectedPlant ? (
                <>
                  {/* Plant Title */}
                  <Text style={[globalStyles.modalTitle, styles.modalTitle]}>{selectedPlant.name}</Text>
                  {/* Plant Details Card */}
                  <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                      <Text style={[globalStyles.plantName, styles.detailLabel]}>Light level:</Text>
                      <Text style={styles.detailValue}>{selectedPlant.lightLevel}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={[globalStyles.plantName, styles.detailLabel]}>Ideal:</Text>
                      <Text style={styles.detailValue}>
                        {selectedPlant.thrivesMinLux} - {selectedPlant.thrivesMaxLux} lux
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={[globalStyles.plantName, styles.detailLabel]}>Tolerates:</Text>
                      <Text style={styles.detailValue}>
                        {selectedPlant.growsWellMinLux} - {selectedPlant.growsWellMaxLux} lux
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={[globalStyles.plantName, styles.detailLabel]}>Height:</Text>
                      <Text style={styles.detailValue}>{selectedPlant.height}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={[globalStyles.plantName, styles.detailLabel]}>Watering:</Text>
                      <Text style={styles.detailValue}>{selectedPlant.waterRequirement}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={[globalStyles.plantName, styles.detailLabel]}>Love level:</Text>
                      <Text style={styles.detailValue}>{selectedPlant.loveLevel}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={[globalStyles.plantName, styles.detailLabel]}>Pet safe:</Text>
                      <Text style={styles.detailValue}>{selectedPlant.petsafe ? 'Yes' : 'No'}</Text>
                    </View>
                  </View>
                  {/* Close Button */}
                  <TouchableOpacity style={globalStyles.modalClose} onPress={() => setModalVisible(false)}>
                    <Text style={globalStyles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    // Keep empty to inherit from globalStyles
  },
  introSection: {
    backgroundColor: '#F5F5F5', 
    paddingBottom: normalize(10),
    alignItems: 'center',
  },
  introText: {
    width: '80%',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: normalize(10),
    marginBottom: normalize(20),
    marginTop: normalize(20),
    borderWidth: 1,
    borderColor: '#97B598',
  },
  searchIcon: { 
    marginRight: normalize(8) 
  },
  searchInput: { 
    flex: 1, 
    height: normalize(40), 
    fontSize: FONT_SIZE.REGULAR, 
    color: '#000000',
    fontFamily: FONT_FAMILY.REGULAR,
  },
  resultsList: { 
    flex: 1 
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
  // Modal Styles
  modalContainer: {
    width: screenWidth * 0.85, 
    maxHeight: '70%', 
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: normalize(20),
    alignItems: 'center', 
  },
  modalTitle: {
    marginBottom: normalize(20),
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#97B598',
    borderRadius: 8,
    padding: normalize(15),
    width: '100%',
    marginBottom: normalize(20),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  detailLabel: {
    width: normalize(100),
  },
  detailValue: {
    fontSize: FONT_SIZE.MEDIUM,
    color: '#757575',
    fontFamily: FONT_FAMILY.REGULAR,
    flex: 1,
    marginLeft: normalize(10),
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: normalize(10),
  },
});

export default AboutScreen;