// NormalModeContent.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, typography } from '../utils/globalStyles';
import plantProfileStyles from '../utils/plantProfileStyles';

const NormalModeContent = ({ 
  filters,
  setFilters,
  modalVisible,
  setModalVisible,
  clearFilters,
  filterOptions
}) => {
  return (
    <ScrollView style={globalStyles.scrollContainer}>
      <View style={globalStyles.contentWrapper}>
        <View style={plantProfileStyles.container}>
          {/* Plant Profile Header with subtitle badge */}
          <View style={plantProfileStyles.cardHeader}>
            <Text style={plantProfileStyles.cardTitle}>My plant profile</Text>
          </View>
          
          {/* Plant profile story - keeping the original green buttons */}
          <View style={plantProfileStyles.storyContainer}>
            <Text style={plantProfileStyles.storyText}>I'd</Text>
            <Text style={plantProfileStyles.storyText}>love</Text>
            <Text style={plantProfileStyles.storyText}>a </Text>
            <TouchableOpacity 
              style={[plantProfileStyles.storyButton, filters.size ? plantProfileStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, size: true }))}
            >
              <Icon 
                name="resize-outline" 
                size={normalize(16)} 
                color={filters.size ? colors.textLight : colors.textPrimary} 
                style={plantProfileStyles.storyButtonIcon} 
              />
              <Text style={[plantProfileStyles.storyButtonLabel, filters.size ? plantProfileStyles.activeStoryButtonLabel : null]}>
                {filters.size ? 
                  filters.size.replace(/ \(<\d+ cm\)|\(50-\d+ cm\)|\(>\d+ cm\)/, '') : 
                  '___'}
              </Text>
            </TouchableOpacity>
            
            <Text style={plantProfileStyles.storyText}> plant</Text>
            <Text style={plantProfileStyles.storyText}>with </Text>
            <TouchableOpacity 
              style={[plantProfileStyles.storyButton, filters.looks ? plantProfileStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, looks: true }))}
            >
              <Icon 
                name="flower-outline" 
                size={normalize(16)} 
                color={filters.looks ? colors.textLight : colors.textPrimary} 
                style={plantProfileStyles.storyButtonIcon} 
              />
              <Text style={[plantProfileStyles.storyButtonLabel, filters.looks ? plantProfileStyles.activeStoryButtonLabel : null]}>
                {filters.looks || '___'}
              </Text>
            </TouchableOpacity>
            
            <Text style={plantProfileStyles.storyText}> looks.</Text>
            <Text style={plantProfileStyles.storyText}>I'll</Text>
            <Text style={plantProfileStyles.storyText}>water</Text>
            <Text style={plantProfileStyles.storyText}>it </Text>
            <TouchableOpacity 
              style={[plantProfileStyles.storyButton, filters.watering ? plantProfileStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, watering: true }))}
            >
              <Icon 
                name="water-outline" 
                size={normalize(16)} 
                color={filters.watering ? colors.textLight : colors.textPrimary} 
                style={plantProfileStyles.storyButtonIcon} 
              />
              <Text style={[plantProfileStyles.storyButtonLabel, filters.watering ? plantProfileStyles.activeStoryButtonLabel : null]}>
                {filters.watering || '___'}
              </Text>
            </TouchableOpacity>
            
            <Text style={plantProfileStyles.storyText}> and</Text>
            <Text style={plantProfileStyles.storyText}>give</Text>
            <Text style={plantProfileStyles.storyText}>it </Text>
            <TouchableOpacity 
              style={[plantProfileStyles.storyButton, filters.loveLevel ? plantProfileStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, loveLevel: true }))}
            >
              <Icon 
                name="heart-outline" 
                size={normalize(16)} 
                color={filters.loveLevel ? colors.textLight : colors.textPrimary} 
                style={plantProfileStyles.storyButtonIcon} 
              />
              <Text style={[plantProfileStyles.storyButtonLabel, filters.loveLevel ? plantProfileStyles.activeStoryButtonLabel : null]}>
                {filters.loveLevel || '___'}
              </Text>
            </TouchableOpacity>
            
            <Text style={plantProfileStyles.storyText}> love.</Text>
            <Text style={plantProfileStyles.storyText}>Pets</Text>
            <Text style={plantProfileStyles.storyText}>around? </Text>
            <TouchableOpacity 
              style={[plantProfileStyles.storyButton, filters.pets ? plantProfileStyles.activeStoryButton : null]} 
              onPress={() => setModalVisible(prev => ({ ...prev, pets: true }))}
            >
              <Icon 
                name="paw-outline" 
                size={normalize(16)} 
                color={filters.pets ? colors.textLight : colors.textPrimary} 
                style={plantProfileStyles.storyButtonIcon} 
              />
              <Text style={[plantProfileStyles.storyButtonLabel, filters.pets ? plantProfileStyles.activeStoryButtonLabel : null]}>
                {filters.pets ? (filters.pets === 'hell yeah!' ? 'Yes' : filters.pets) : '___'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Clear filters button */}
          <View style={plantProfileStyles.clearButtonContainer}>
            <TouchableOpacity 
              style={plantProfileStyles.clearButton}
              onPress={clearFilters}
            >
              <Icon 
                name="refresh-outline" 
                size={normalize(14)} 
                color={colors.textPrimary} 
                style={plantProfileStyles.clearButtonIcon} 
              />
              <Text style={plantProfileStyles.clearButtonText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default NormalModeContent;