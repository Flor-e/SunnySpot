import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { plantsData } from '../utils/plantAdvice';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, typography } from '../utils/globalStyles';
import searchScreenStyles from '../utils/searchScreenStyles';
import { getImageSource } from '../utils/imageMap';
import { useFavorites } from '../contexts/FavoriteContext';
import { PlantDetailModal } from './AppModals';

const { width: screenWidth } = Dimensions.get('window');

const AboutScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const { favoritePlants, setFavoritePlants } = useFavorites();

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

  const toggleFavorite = (plant) => {
    if (favoritePlants.some((fav) => fav.name === plant.name)) {
      setFavoritePlants((prev) => prev.filter((fav) => fav.name !== plant.name));
    } else {
      setFavoritePlants((prev) => [...prev, plant]);
    }
  };

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity onPress={() => openPlantModal(item)} style={[searchScreenStyles.cardTile, searchScreenStyles.horizontalCardContainer]}>
      <Image
        source={getImageSource(item.name)}
        style={searchScreenStyles.cardImage}
        resizeMode="contain"
        onError={(e) => console.log(`Image load error for ${item.name}:`, e.nativeEvent.error)}
      />
      <View style={searchScreenStyles.cardTextContainer}>
        <Text style={searchScreenStyles.plantName}>{item.name}</Text>
        <Text style={searchScreenStyles.standout}>{item.tagline}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header Section */}
      <View style={[globalStyles.headerSection, searchScreenStyles.headerSection]}>
        <Text style={globalStyles.title}>Search plant database</Text>
      </View>

      <View style={searchScreenStyles.spacingView} />

      {/* Intro Section */}
      <View style={searchScreenStyles.introSection}>
        <Text style={[searchScreenStyles.instructionText, searchScreenStyles.introText]}>
          I hope you found the perfect plant for your spot! This app was made with love by me (
          <Text
            style={searchScreenStyles.linkText}
            onPress={() => Linking.openURL('https://www.x.com/lavie_flori')}
          >
            @Lavie_Flori
          </Text>
          ) and coded by AI (Grok 2 and Claude 3.7). Grok also created all of the plant artwork.
        </Text>
      </View>

      {/* Search resuls body */}
      <View style={globalStyles.bodySection}>
        <View style={searchScreenStyles.searchContainer}>
          <Icon name="search-outline" size={normalize(20)} color="#757575" style={searchScreenStyles.searchIcon} />
          <TextInput
            style={searchScreenStyles.searchInput}
            placeholder="Type plant name"
            placeholderTextColor="#757575"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        {searchQuery.trim() === '' ? (
          <Text style={searchScreenStyles.instructionText} />
        ) : filteredPlants.length > 0 ? (
          <FlatList
            data={filteredPlants}
            renderItem={renderPlantItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            style={searchScreenStyles.resultsList}
            contentContainerStyle={{ paddingBottom: normalize(80) }}
          />
        ) : (
          <Text style={[searchScreenStyles.instructionText, searchScreenStyles.noResultsText]}>
            No plants found matching "{searchQuery}".
          </Text>
        )}
      </View>

      {/* Modal */}
      <PlantDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedPlant={selectedPlant}
        toggleFavorite={toggleFavorite}
        favoritePlants={favoritePlants}
      />
    </View>
  );
};

export default AboutScreen;