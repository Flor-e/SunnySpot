// NormalModeContent.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles, { colors } from '../utils/globalStyles';

const NormalModeContent = ({ 
  filters,
  setFilters,
  modalVisible,
  setModalVisible,
  clearFilters,
  filterOptions
}) => {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={globalStyles.contentWrapper}>
        <View style={[globalStyles.nerdCard, globalStyles.cardBorder]}>
          {/* Plant Profile Header with subtitle badge */}
          <View style={globalStyles.nerdCardHeader}>
            <Text style={globalStyles.nerdCardTitle}>My plant profile</Text>
          </View>
          
          {/* Plant profile story - keeping the original green buttons */}
          <View style={globalStyles.plantProfileStoryContainer}>
            <Text style={globalStyles.storyText}>I'd</Text>
            <Text style={globalStyles.storyText}>love</Text>
            <Text style={globalStyles.storyText}>a </Text>
            <TouchableOpacity 
              style={[globalStyles.storyButton, filters.size ? globalStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, size: true }))}
            >
              <Icon name="resize-outline" size={16} color={filters.size ? colors.textLight : colors.textPrimary} style={globalStyles.storyButtonIcon} />
              <Text style={[globalStyles.storyButtonLabel, filters.size ? globalStyles.activeStoryButtonLabel : null]}>
                {filters.size ? 
                  filters.size.replace(/ \(<\d+ cm\)|\(50-\d+ cm\)|\(>\d+ cm\)/, '') : 
                  '___'}
              </Text>
            </TouchableOpacity>
            
            <Text style={globalStyles.storyText}> plant</Text>
            <Text style={globalStyles.storyText}>with </Text>
            <TouchableOpacity 
              style={[globalStyles.storyButton, filters.looks ? globalStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, looks: true }))}
            >
              <Icon name="flower-outline" size={16} color={filters.looks ? colors.textLight : colors.textPrimary} style={globalStyles.storyButtonIcon} />
              <Text style={[globalStyles.storyButtonLabel, filters.looks ? globalStyles.activeStoryButtonLabel : null]}>
                {filters.looks || '___'}
              </Text>
            </TouchableOpacity>
            
            <Text style={globalStyles.storyText}> looks.</Text>
            <Text style={globalStyles.storyText}>I'll</Text>
            <Text style={globalStyles.storyText}>water</Text>
            <Text style={globalStyles.storyText}>it </Text>
            <TouchableOpacity 
              style={[globalStyles.storyButton, filters.watering ? globalStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, watering: true }))}
            >
              <Icon name="water-outline" size={16} color={filters.watering ? colors.textLight : colors.textPrimary} style={globalStyles.storyButtonIcon} />
              <Text style={[globalStyles.storyButtonLabel, filters.watering ? globalStyles.activeStoryButtonLabel : null]}>
                {filters.watering || '___'}
              </Text>
            </TouchableOpacity>
            
            <Text style={globalStyles.storyText}> and</Text>
            <Text style={globalStyles.storyText}>give</Text>
            <Text style={globalStyles.storyText}>it</Text>
            <TouchableOpacity 
              style={[globalStyles.storyButton, filters.loveLevel ? globalStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, loveLevel: true }))}
            >
              <Icon name="heart-outline" size={16} color={filters.loveLevel ? colors.textLight : colors.textPrimary} style={globalStyles.storyButtonIcon} />
              <Text style={[globalStyles.storyButtonLabel, filters.loveLevel ? globalStyles.activeStoryButtonLabel : null]}>
                {filters.loveLevel || '___'}
              </Text>
            </TouchableOpacity>
            
            <Text style={globalStyles.storyText}> love.</Text>
            <Text style={globalStyles.storyText}>Pets</Text>
            <Text style={globalStyles.storyText}>around? </Text>
            <TouchableOpacity 
              style={[globalStyles.storyButton, filters.pets ? globalStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, pets: true }))}
            >
              <Icon name="paw-outline" size={16} color={filters.pets ? colors.textLight : colors.textPrimary} style={globalStyles.storyButtonIcon} />
              <Text style={[globalStyles.storyButtonLabel, filters.pets ? globalStyles.activeStoryButtonLabel : null]}>
                {filters.pets ? (filters.pets === 'hell yeah!' ? 'Yes' : filters.pets) : '___'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Soft lavender divider */}
          <View style={styles.dividerContainer}>
            <View style={globalStyles.divider} />
          </View>
          
          {/* Clear filters button - Updated to use lavender accent */}
          <View style={globalStyles.clearButtonContainer}>
            <TouchableOpacity 
              style={[
                globalStyles.clearButton,
                styles.accentClearButton
              ]}
              onPress={clearFilters}
            >
              <Icon name="refresh-outline" size={14} color={colors.textPrimary} style={globalStyles.clearButtonIcon} />
              <Text style={[globalStyles.clearButtonText, styles.accentClearButtonText]}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  dividerContainer: {
    paddingVertical: 10,
    marginTop: 8,
},
});

export default NormalModeContent;