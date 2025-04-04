// NerdModeContent.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT } from '../utils/globalStyles';

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
  logbooks,
}) => {
  const [viewMode, setViewMode] = useState('lightDetails');

  // Use useEffect to update UI when selectedLogbook or its filters change
  useEffect(() => {
  }, [selectedLogbook, selectedLogbook?.plantProfile, slotCounts]);

  // If no logbooks exist, show a different message
  if (logbooks.length === 0) {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={globalStyles.contentWrapper}>
          <View style={[globalStyles.nerdCard, globalStyles.cardBorder, { alignItems: 'center', padding: normalize(20) }]}>
            <Text style={globalStyles.nerdCardTitle}>No logbooks</Text>
            <Text style={globalStyles.nerdCardBodyText}>
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
      <ScrollView style={styles.scrollContainer}>
        <View style={globalStyles.contentWrapper}>
          <View style={[globalStyles.nerdCard, globalStyles.cardBorder, { alignItems: 'center', padding: normalize(20) }]}>
            <Text style={globalStyles.nerdCardTitle}>No Logbook Selected</Text>
            <Text style={globalStyles.nerdCardBodyText}>
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
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContent}
    >
      <View style={globalStyles.contentWrapper}>
        <View style={[globalStyles.nerdCard, globalStyles.cardBorder, styles.cardContainer]}>
          <TouchableOpacity
            style={styles.toggleChevron}
            onPress={() => setViewMode(viewMode === 'plantProfile' ? 'lightDetails' : 'plantProfile')}
          >
            <Icon 
              name={viewMode === 'plantProfile' ? 'chevron-back' : 'chevron-forward'} 
              size={normalize(20)} 
              color={colors.textLight}  
            />
          </TouchableOpacity>
          
          {viewMode === 'plantProfile' ? (
            <View style={globalStyles.nerdCardContent}>
              {/* Plant Profile Header with subtitle badge */}
              <View style={globalStyles.nerdCardHeader}>
                <Text style={globalStyles.nerdCardTitle}>My plant profile</Text>
              </View>
              <View style={globalStyles.subtitleBadge}>
                <Text style={globalStyles.badgeText}>{selectedLogbook?.title || "New"}</Text>
              </View>
              
              {/* Plant profile story - using currentFilters from selectedLogbook */}
              <View style={globalStyles.plantProfileStoryContainer}>
                <Text style={globalStyles.storyText}>I'd</Text>
                <Text style={globalStyles.storyText}>love</Text>
                <Text style={globalStyles.storyText}>a </Text>
                <TouchableOpacity 
                  style={[globalStyles.storyButton, currentFilters.size ? globalStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, size: true }))}
                >
                  <Icon 
                    name="resize-outline" 
                    size={normalize(16)} 
                    color={currentFilters.size ? colors.textLight : colors.textPrimary} 
                    style={globalStyles.storyButtonIcon} 
                  />
                  <Text style={[globalStyles.storyButtonLabel, currentFilters.size ? globalStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.size ? 
                      currentFilters.size.replace(/ \(<\d+ cm\)|\(50-\d+ cm\)|\(>\d+ cm\)/, '') : 
                      '___'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={globalStyles.storyText}> plant</Text>
                <Text style={globalStyles.storyText}>with </Text>
                <TouchableOpacity 
                  style={[globalStyles.storyButton, currentFilters.looks ? globalStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, looks: true }))}
                >
                  <Icon 
                    name="flower-outline" 
                    size={normalize(16)} 
                    color={currentFilters.looks ? colors.textLight : colors.textPrimary} 
                    style={globalStyles.storyButtonIcon} 
                  />
                  <Text style={[globalStyles.storyButtonLabel, currentFilters.looks ? globalStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.looks || '___'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={globalStyles.storyText}> looks.</Text>
                <Text style={globalStyles.storyText}>I'll</Text>
                <Text style={globalStyles.storyText}>water</Text>
                <Text style={globalStyles.storyText}>it </Text>
                <TouchableOpacity 
                  style={[globalStyles.storyButton, currentFilters.watering ? globalStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, watering: true }))}
                >
                  <Icon 
                    name="water-outline" 
                    size={normalize(16)} 
                    color={currentFilters.watering ? colors.textLight : colors.textPrimary} 
                    style={globalStyles.storyButtonIcon} 
                  />
                  <Text style={[globalStyles.storyButtonLabel, currentFilters.watering ? globalStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.watering || '___'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={globalStyles.storyText}> and</Text>
                <Text style={globalStyles.storyText}>give</Text>
                <Text style={globalStyles.storyText}>it </Text>
                <TouchableOpacity 
                  style={[globalStyles.storyButton, currentFilters.loveLevel ? globalStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, loveLevel: true }))}
                >
                  <Icon 
                    name="heart-outline" 
                    size={normalize(16)} 
                    color={currentFilters.loveLevel ? colors.textLight : colors.textPrimary} 
                    style={globalStyles.storyButtonIcon} 
                  />
                  <Text style={[globalStyles.storyButtonLabel, currentFilters.loveLevel ? globalStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.loveLevel || '___'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={globalStyles.storyText}> love.</Text>
                <Text style={globalStyles.storyText}>Pets</Text>
                <Text style={globalStyles.storyText}>around? </Text>
                <TouchableOpacity 
                  style={[globalStyles.storyButton, currentFilters.pets ? globalStyles.activeStoryButton : null]} 
                  onPress={() => setModalVisible(prev => ({ ...prev, pets: true }))}
                >
                  <Icon 
                    name="paw-outline" 
                    size={normalize(16)} 
                    color={currentFilters.pets ? colors.textLight : colors.textPrimary} 
                    style={globalStyles.storyButtonIcon} 
                  />
                  <Text style={[globalStyles.storyButtonLabel, currentFilters.pets ? globalStyles.activeStoryButtonLabel : null]}>
                    {currentFilters.pets ? (currentFilters.pets === 'hell yeah!' ? 'Yes' : currentFilters.pets) : '___'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Soft lavender divider */}
              <View style={styles.dividerContainer}>
                <View style={[globalStyles.divider, { marginTop: normalize(7) }]} />
              </View>

              {/* Clear filters button */}
              <View style={globalStyles.clearButtonContainer}>
                <TouchableOpacity 
                  style={globalStyles.clearButton} 
                  onPress={clearFilters}
                >
                  <Icon name="refresh-outline" size={normalize(14)} color={colors.textPrimary} style={globalStyles.clearButtonIcon} />
                  <Text style={globalStyles.clearButtonText}>Clear filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={globalStyles.nerdCardContent}>
              {/* Light Logbook Header with subtitle badge */}
              <View style={globalStyles.nerdCardHeader}>
                <Text style={globalStyles.nerdCardTitle}>My light logbook</Text>
                
                {/* Bin icon positioned beside the title with 3pts spacing */}
                <TouchableOpacity
                  style={styles.binIcon}
                  onPress={() => setModalVisible(prev => ({ ...prev, deleteLogbook: true }))}
                >
                  <Icon name="trash-outline" size={normalize(18)} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <View style={globalStyles.subtitleBadge}>
                <Text style={globalStyles.badgeText}>{selectedLogbook?.title || "New"}</Text>
              </View>
              
              {/* Main content */}
              {selectedLogbook.measurements.length === 0 ? (
                <View style={globalStyles.infoContainer}>
                  <Text style={globalStyles.storyText}>Take your first light measurement</Text>
                  <Text style={globalStyles.storyText}>to start tracking this spot's light.</Text>
                </View>
              ) : (
                <>
                  <View style={globalStyles.infoContainer}>
                    <Text style={globalStyles.storyText}>This spot receives on average </Text>
                    <Text style={styles.highlightedText}>{getLightLevel(selectedLogbook.average)}</Text>
                    <Text style={globalStyles.storyText}> ({Math.round(selectedLogbook.average)} lux),</Text>
                    <Text style={globalStyles.storyText}> based on </Text>
                    <Text style={styles.highlightedText}>{slotCounts.morning}</Text>
                    <Text style={globalStyles.storyText}> morning, </Text>
                    <Text style={styles.highlightedText}>{slotCounts.afternoon}</Text>
                    <Text style={globalStyles.storyText}> afternoon, </Text>
                    <Text style={styles.highlightedText}>{slotCounts.evening}</Text>
                    <Text style={globalStyles.storyText}> evening</Text>
                    <Text style={globalStyles.storyText}> measurements.</Text>
                  </View>

                  {selectedLogbook.measurements.length > 0 && (
                    <>
                      {/* Divider with consistent spacing */}
                      <View style={styles.dividerContainer}>
                        <View style={globalStyles.divider} />
                      </View>
                      
                      {/* Last measurement label */}
                      <View style={globalStyles.lastMeasurementLabelContainer}>
                        <Text style={globalStyles.storyText}>Last measurement:</Text>
                      </View>
                      
                      {/* Last measurement value on its own line */}
                      <View style={globalStyles.lastMeasurementValueContainer}>
                        <Text style={styles.highlightedText}>{getLightLevel(selectedLogbook.measurements[selectedLogbook.measurements.length - 1].lux)}</Text>
                        <Text style={globalStyles.storyText}> ({selectedLogbook.measurements[selectedLogbook.measurements.length - 1].lux} lux)</Text>
                      </View>
                    </>
                  )}
                </>
              )}
              
              <View style={globalStyles.logbookButtonContainer}>
                <TouchableOpacity
                  style={[globalStyles.logbookActionButton, !selectedLogbook.measurements.length && globalStyles.logbookDisabledButton]}
                  onPress={triggerPlantAdvice}
                  disabled={!selectedLogbook.measurements.length}
                >
                  <View style={globalStyles.logbookButtonContent}>
                    <Icon name="leaf-outline" size={normalize(16)} color={colors.textLight} style={globalStyles.logbookButtonIcon} />
                    <Text style={globalStyles.logbookButtonText}>Matches</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    globalStyles.logbookActionButton, 
                    globalStyles.logbookActionButtonSecondary, 
                    !selectedLogbook.measurements.length && globalStyles.logbookDisabledButton
                  ]}
                  onPress={() => setModalVisible(prev => ({ ...prev, history: true }))}
                  disabled={!selectedLogbook.measurements.length}
                >
                  <View style={globalStyles.logbookButtonContent}>
                    <Icon name="document-outline" size={normalize(16)} color={colors.textLight} style={globalStyles.logbookButtonIcon} />
                    <Text style={globalStyles.logbookButtonText}>History</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { 
    flex: 1,
  },
  scrollContent: {
    // We keep this empty but define it to ensure consistent styling
  },
  cardContainer: {
    position: 'relative', 
  },
  dividerContainer: {
    paddingVertical: normalize(10), 
    marginTop: 0,
  },
  binIcon: {
    marginLeft: normalize(3), 
    marginBottom: normalize(2),
  },
  toggleChevron: {
    position: 'absolute',
    right: normalize(-12), 
    top: '50%', 
    transform: [{ translateY: normalize(-12) }], 
    backgroundColor: colors.accent,
    width: normalize(25),
    height: normalize(25),
    borderRadius: normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10
  },
  highlightedText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    color: colors.textPrimary,
  },
});

export default NerdModeContent;