// NerdModeContent.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, typography } from '../utils/globalStyles';
import plantProfileStyles from '../utils/plantProfileStyles';
import lightLogbookStyles from '../utils/lightLogbookStyles.js';

const NerdModeContent = ({ 
  selectedLogbook,
  filters, 
  setFilters, 
  slotCounts,
  modalVisible,
  setModalVisible,
  clearFilters,
  triggerPlantAdvice,
  getLightLevel,
  getTimeOfDay,
  logbooks,
}) => {
  const [viewMode, setViewMode] = useState('lightDetails');

  // Use useEffect to update UI when selectedLogbook or its filters change
  useEffect(() => {
  }, [selectedLogbook, selectedLogbook?.plantProfile, slotCounts]);

  // If no logbooks exist, show a different message
  if (logbooks.length === 0) {
    return (
      <ScrollView style={globalStyles.scrollContainer}>
        <View style={globalStyles.contentWrapper}>
          <View style={[lightLogbookStyles.container, { alignItems: 'center', padding: normalize(20) }]}>
            <Text style={lightLogbookStyles.cardTitle}>No logbooks</Text>
            <Text style={lightLogbookStyles.bodyText}>
              Create your first light logbook!
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // If no logbook is selected but logbooks exist, show the original message
  if (!selectedLogbook) {
    return (
      <ScrollView style={globalStyles.scrollContainer}>
        <View style={globalStyles.contentWrapper}>
          <View style={[lightLogbookStyles.container, { alignItems: 'center', padding: normalize(20) }]}>
            <Text style={lightLogbookStyles.cardTitle}>No Logbook Selected</Text>
            <Text style={lightLogbookStyles.bodyText}>
            Please select or create a logbook using the dropdown menu at the top.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Always use the current filters from the selectedLogbook
  const currentFilters = selectedLogbook.plantProfile || { size: '', looks: '', loveLevel: '', watering: '', pets: '' };

  return (
    <ScrollView 
      style={globalStyles.scrollContainer} 
    >
      <View style={globalStyles.contentWrapper}>
        <View style={[viewMode === 'plantProfile' ? plantProfileStyles.container : lightLogbookStyles.container, lightLogbookStyles.cardContainer]}>
          <TouchableOpacity
            style={lightLogbookStyles.toggleChevron}
            onPress={() => setViewMode(viewMode === 'plantProfile' ? 'lightDetails' : 'plantProfile')}
          >
            <Icon 
              name={viewMode === 'plantProfile' ? 'chevron-back' : 'chevron-forward'} 
              size={normalize(20)} 
              color={colors.textLight}  
            />
          </TouchableOpacity>
          
          {viewMode === 'plantProfile' ? (
            <View style={plantProfileStyles.contentContainer}>
              {/* Plant Profile Header with subtitle badge */}
              <View style={plantProfileStyles.cardHeader}>
                <Text style={plantProfileStyles.cardTitle}>My plant profile</Text>
              </View>
              
              {/* Plant profile story - using currentFilters from selectedLogbook */}
              <View style={plantProfileStyles.storyContainer}>
                <Text style={plantProfileStyles.storyText}>I'd</Text>
                <Text style={plantProfileStyles.storyText}>love</Text>
                <Text style={plantProfileStyles.storyText}>a </Text>
                <TouchableOpacity 
                  style={[plantProfileStyles.storyButton, currentFilters.size ? plantProfileStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, size: true }))}
                >
                  <Icon 
                    name="resize-outline" 
                    size={normalize(16)} 
                    color={currentFilters.size ? colors.textLight : colors.textPrimary} 
                    style={plantProfileStyles.storyButtonIcon} 
                  />
                  <Text style={[plantProfileStyles.storyButtonLabel, currentFilters.size ? plantProfileStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.size ? 
                      currentFilters.size.replace(/ \(<\d+ cm\)|\(50-\d+ cm\)|\(>\d+ cm\)/, '') : 
                      '___'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={plantProfileStyles.storyText}> plant</Text>
                <Text style={plantProfileStyles.storyText}>with </Text>
                <TouchableOpacity 
                  style={[plantProfileStyles.storyButton, currentFilters.looks ? plantProfileStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, looks: true }))}
                >
                  <Icon 
                    name="flower-outline" 
                    size={normalize(16)} 
                    color={currentFilters.looks ? colors.textLight : colors.textPrimary} 
                    style={plantProfileStyles.storyButtonIcon} 
                  />
                  <Text style={[plantProfileStyles.storyButtonLabel, currentFilters.looks ? plantProfileStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.looks || '___'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={plantProfileStyles.storyText}> looks.</Text>
                <Text style={plantProfileStyles.storyText}>I'll</Text>
                <Text style={plantProfileStyles.storyText}>water</Text>
                <Text style={plantProfileStyles.storyText}>it </Text>
                <TouchableOpacity 
                  style={[plantProfileStyles.storyButton, currentFilters.watering ? plantProfileStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, watering: true }))}
                >
                  <Icon 
                    name="water-outline" 
                    size={normalize(16)} 
                    color={currentFilters.watering ? colors.textLight : colors.textPrimary} 
                    style={plantProfileStyles.storyButtonIcon} 
                  />
                  <Text style={[plantProfileStyles.storyButtonLabel, currentFilters.watering ? plantProfileStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.watering || '___'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={plantProfileStyles.storyText}> and</Text>
                <Text style={plantProfileStyles.storyText}>give</Text>
                <Text style={plantProfileStyles.storyText}>it </Text>
                <TouchableOpacity 
                  style={[plantProfileStyles.storyButton, currentFilters.loveLevel ? plantProfileStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, loveLevel: true }))}
                >
                  <Icon 
                    name="heart-outline" 
                    size={normalize(16)} 
                    color={currentFilters.loveLevel ? colors.textLight : colors.textPrimary} 
                    style={plantProfileStyles.storyButtonIcon} 
                  />
                  <Text style={[plantProfileStyles.storyButtonLabel, currentFilters.loveLevel ? plantProfileStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.loveLevel || '___'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={plantProfileStyles.storyText}> love.</Text>
                <Text style={plantProfileStyles.storyText}>Pets</Text>
                <Text style={plantProfileStyles.storyText}>around? </Text>
                <TouchableOpacity 
                  style={[plantProfileStyles.storyButton, currentFilters.pets ? plantProfileStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, pets: true }))}
                >
                  <Icon 
                    name="paw-outline" 
                    size={normalize(16)} 
                    color={currentFilters.pets ? colors.textLight : colors.textPrimary} 
                    style={plantProfileStyles.storyButtonIcon} 
                  />
                  <Text style={[plantProfileStyles.storyButtonLabel, currentFilters.pets ? plantProfileStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.pets ? (currentFilters.pets === 'hell yeah!' ? 'Yes' : currentFilters.pets) : '___'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Clear filters button */}
              <View style={plantProfileStyles.clearButtonContainer}>
                <TouchableOpacity 
                  style={plantProfileStyles.clearButton} 
                  onPress={clearFilters}
                >
                  <Icon name="refresh-outline" size={normalize(14)} color={colors.textPrimary} style={plantProfileStyles.clearButtonIcon} />
                  <Text style={plantProfileStyles.clearButtonText}>Clear filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={lightLogbookStyles.contentContainer}>
              {/* Light Logbook Header with subtitle badge */}
              <View style={lightLogbookStyles.cardHeader}>
                <Text style={lightLogbookStyles.cardTitle}>My light logbook</Text>
                
                {/* Bin icon positioned beside the title with 3pts spacing */}
                <TouchableOpacity
                  style={lightLogbookStyles.binIcon}
                  onPress={() => setModalVisible(prev => ({ ...prev, deleteLogbook: true }))}
                >
                  <Icon name="trash-outline" size={normalize(18)} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              {/* Main content */}
              {selectedLogbook.measurements.length === 0 ? (
                <View style={lightLogbookStyles.infoContainer}>
                  <Text style={lightLogbookStyles.storyText}>Take your first light measurement</Text>
                  <Text style={lightLogbookStyles.storyText}>to start tracking this spot's light.</Text>
                </View>
              ) : (
                <>
                  <View style={lightLogbookStyles.infoContainer}>
                    <Text style={lightLogbookStyles.storyText}>This spot receives on average </Text>
                    <Text style={lightLogbookStyles.highlightedText}>{getLightLevel(selectedLogbook.average)}</Text>
                    <Text style={lightLogbookStyles.storyText}> ({Math.round(selectedLogbook.average)} lux),</Text>
                    <Text style={lightLogbookStyles.storyText}> based on </Text>
                    <Text style={lightLogbookStyles.highlightedText}>{slotCounts.morning}</Text>
                    <Text style={lightLogbookStyles.storyText}> morning, </Text>
                    <Text style={lightLogbookStyles.highlightedText}>{slotCounts.afternoon}</Text>
                    <Text style={lightLogbookStyles.storyText}> afternoon, </Text>
                    <Text style={lightLogbookStyles.highlightedText}>{slotCounts.evening}</Text>
                    <Text style={lightLogbookStyles.storyText}> evening</Text>
                    <Text style={lightLogbookStyles.storyText}> measurements.</Text>
                  </View>

                  {selectedLogbook.measurements.length > 0 && (
                    <>
                      {/* Divider with consistent spacing */}
                      <View style={lightLogbookStyles.dividerContainer}>
                        <View style={lightLogbookStyles.divider} />
                      </View>
                      
                      {/* Last measurement label */}
                      <View style={lightLogbookStyles.lastMeasurementLabelContainer}>
                        <Text style={lightLogbookStyles.storyText}>Last measurement:</Text>
                      </View>
                      
                      {/* Last measurement value on its own line */}
                      <View style={lightLogbookStyles.lastMeasurementValueContainer}>
                        <Text style={lightLogbookStyles.highlightedText}>{getLightLevel(selectedLogbook.measurements[selectedLogbook.measurements.length - 1].lux)}</Text>
                        <Text style={lightLogbookStyles.storyText}> ({selectedLogbook.measurements[selectedLogbook.measurements.length - 1].lux} lux)</Text>
                      </View>
                    </>
                  )}
                </>
              )}
              
              <View style={lightLogbookStyles.logbookButtonContainer}>
                <TouchableOpacity
                  style={[lightLogbookStyles.logbookActionButton, !selectedLogbook.measurements.length && lightLogbookStyles.logbookDisabledButton]}
                  onPress={triggerPlantAdvice}
                  disabled={!selectedLogbook.measurements.length}
                >
                  <View style={lightLogbookStyles.logbookButtonContent}>
                    <Icon name="leaf-outline" size={normalize(16)} color={colors.textLight} style={lightLogbookStyles.logbookButtonIcon} />
                    <Text style={lightLogbookStyles.logbookButtonText}>Matches</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    lightLogbookStyles.logbookActionButton, 
                    lightLogbookStyles.logbookActionButtonSecondary, 
                    !selectedLogbook.measurements.length && lightLogbookStyles.logbookDisabledButton
                  ]}
                  onPress={() => setModalVisible(prev => ({ ...prev, history: true }))}
                  disabled={!selectedLogbook.measurements.length}
                >
                  <View style={lightLogbookStyles.logbookButtonContent}>
                    <Icon name="document-outline" size={normalize(16)} color={colors.textLight} style={lightLogbookStyles.logbookButtonIcon} />
                    <Text style={lightLogbookStyles.logbookButtonText}>History</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
);
}

export default NerdModeContent;