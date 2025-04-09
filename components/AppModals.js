// AppModals.js - A collection of all modal components
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, Dimensions, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, typography } from '../utils/globalStyles';
import modalStyles from '../utils/modalStyles.js';

// Reusable AnimatedModal component with error fix
const AnimatedModal = ({ visible, onRequestClose, children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      // Run entrance animation when modal becomes visible
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset animations when modal is hidden
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="none" // We'll handle animation ourselves
    >
      <View style={modalStyles.modalOverlay}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

// Styling for modals
const styles = {
  modalOption: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10), // Add horizontal padding
    alignItems: 'center',
    width: '100%', // Take up full width
    minWidth: '85%', // Ensure a minimum width
    alignSelf: 'center' // Center itself
  },
  modalOptionText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#425f29'
  },
  modalContent: {
    width: '100%',
    marginBottom: normalize(15),
    flex: 1
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: normalize(10),
    gap: normalize(10)
  },
  spotNameInput: {
    width: 200,
    height: normalize(40),
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 8,
    paddingHorizontal: normalize(10),
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.textDark,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
  },
};

// Lux Info Modal
export const LuxInfoModal = ({ visible, onClose }) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>What is Lux?</Text>
      <ScrollView style={modalStyles.modalScroll}>
        <Text style={modalStyles.modalText}>
          <Text style={modalStyles.modalBoldText}>Lux measures light intensity.</Text> It shows how much light hits a surface, like your plant spot. Higher lux = brighter light.
        </Text>
        {[
          ['Very Low Light', '0 – 500 lux'],
          ['Low Light', '500 – 2.000 lux'],
          ['Medium Light', '2.000 – 10.000 lux'],
          ['Bright Light', '10.000 – 20.000 lux'],
          ['Direct Sunlight', '20.000+ lux'],
        ].map(([label, range]) => (
          <Text key={label} style={modalStyles.modalText}>
            <Text style={modalStyles.modalBoldText}>{label}:</Text> {range}
          </Text>
        ))}
      </ScrollView>
      <TouchableOpacity style={modalStyles.modalClose} onPress={onClose}>
        <Text style={modalStyles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </AnimatedModal>
);

// History Modal
export const HistoryModal = ({ visible, onClose, selectedLogbook, deleteMeasurement }) => {
  const screenHeight = Dimensions.get('window').height;
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState(null);

  const styles = StyleSheet.create({
    modalContent: {
      flex: 1,
      paddingHorizontal: normalize(15),
    },
    historyEntry: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: normalize(5),
      paddingVertical: normalize(10),
      paddingHorizontal: normalize(15),
      width: '95%',
      borderWidth: 1,
      borderRadius: 6,
      borderColor: colors.primaryBorder,
    },
    historyTextContainer: {
      flex: 1,
      marginRight: normalize(10),
    },
    historyText: {
      fontSize: FONT_SIZE.MEDIUM,
      fontFamily: FONT_FAMILY.REGULAR,
      color: '#757575',
      flexWrap: 'wrap',
    },
    lastHistoryText: {
      fontSize: FONT_SIZE.REGULAR,
      fontFamily: FONT_FAMILY.REGULAR,
      fontWeight: FONT_WEIGHT.BOLD,
      color: '#425f29',
      letterSpacing: 0.5,
    },
    trashIcon: {
      padding: normalize(5),
    },
    modalScrollContent: {
      flexGrow: 1,
      paddingBottom: normalize(20),
    },
  });

  // Function to handle the delete confirmation
  const handleDeleteConfirm = () => {
    if (measurementToDelete && selectedLogbook) {
      deleteMeasurement(selectedLogbook.id, measurementToDelete.timestamp);
      setMeasurementToDelete(null);
      setConfirmDeleteVisible(false);
    } else {
      console.error('Cannot delete measurement: missing data', {
        selectedLogbook,
        measurementToDelete
      });
    }
  };

  // Function to show the delete confirmation modal
  const promptDelete = (measurement) => {
    setMeasurementToDelete(measurement);
    setConfirmDeleteVisible(true);
  };

  // Function to close the delete confirmation modal
  const closeConfirmDelete = () => {
    setMeasurementToDelete(null);
    setConfirmDeleteVisible(false);
  };

  // Memoize the sorted measurements
  const sortedMeasurements = useMemo(() => {
    if (!selectedLogbook?.measurements?.length) return [];
    return [...selectedLogbook.measurements].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [selectedLogbook?.measurements]);

  // // Function to format the timestamp and get light level
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const formatMeasurementEntry = (measurement) => {
    const date = new Date(measurement.timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Determine light level based on lux value
    const getLightLevel = (lux) => {
      if (lux > 20000) return 'Direct Sunlight';
      if (lux > 10000) return 'Bright Light';
      if (lux > 2000) return 'Medium Light';
      if (lux > 500) return 'Low Light';
      return 'Very Low Light';
    };

    const lightLevel = getLightLevel(measurement.lux);

    return `${day}-${month}-${year} ${hours}:${minutes} ${lightLevel} (${measurement.lux} lux)`;
  };

  return (
    <>
      <AnimatedModal visible={visible} onRequestClose={onClose}>
        <View style={[modalStyles.modalBox, { height: screenHeight * 0.85, paddingHorizontal: 0 }]}>
          <Text style={modalStyles.modalTitle}>Measurement History</Text>
          {selectedLogbook?.measurements?.length > 0 && (
            <FlatList
              data={sortedMeasurements}
              contentContainerStyle={styles.modalScrollContent}
              style={styles.modalContent}
              renderItem={({ item: measurement, index }) => {
                const isLatest = index === 0;

                return (
                  <View
                    key={measurement.timestamp}
                    style={[
                      styles.historyEntry,
                      index % 2 === 0 ? styles.historyEntryOdd : styles.historyEntryEven,
                      isLatest && { backgroundColor: 'transparent' },
                    ]}
                  >
                    <View style={styles.historyTextContainer}>
                      <Text
                        style={[styles.historyText, isLatest && styles.lastHistoryText]}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {formatMeasurementEntry(measurement)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.trashIcon}
                      onPress={() => promptDelete(measurement)}
                    >
                      <Icon name="trash-outline" size={normalize(18)} color="#757575" />
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item) => item.timestamp}
            />
          )}
          <TouchableOpacity style={modalStyles.modalClose} onPress={onClose}>
            <Text style={modalStyles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </AnimatedModal>

      {/* Confirmation modal for deleting measurement */}
      <ConfirmDeleteMeasurementModal
        visible={confirmDeleteVisible}
        onClose={closeConfirmDelete}
        onConfirm={handleDeleteConfirm}
        timestamp={measurementToDelete?.timestamp}
        formatTimestamp={formatTimestamp}
        lux={measurementToDelete?.lux}
      />
    </>
  );
};

// Create Logbook Modal
export const CreateLogbookModal = ({ visible, onClose, newLogbookName, setNewLogbookName, onCreate }) => {
  const handleCreate = async () => {
    try {
      // Only proceed if the name is not empty after trimming
      if (!newLogbookName.trim()) {
        // Optionally show an alert
        Alert.alert('Error', 'Please enter a logbook name');
        return;
      }

      const success = await onCreate(newLogbookName);
      if (success) {
        onClose();
        // Reset the input after successful creation
        setNewLogbookName('');
      } else {
        // Optionally show an error alert
        Alert.alert('Error', 'Failed to create logbook. Please try again.');
      }
    } catch (error) {
      console.error('Error in modal create:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  // Check if the name is empty after trimming
  const isNameEmpty = !newLogbookName.trim();

  return (
    <AnimatedModal visible={visible} onRequestClose={onClose}>
      <View style={modalStyles.modalBox}>
        <Text style={modalStyles.modalTitle}>Create New Logbook</Text>
        <View style={{ width: '100%', alignItems: 'center', paddingVertical: normalize(20) }}>
          <TextInput
            style={styles.spotNameInput}
            value={newLogbookName}
            onChangeText={setNewLogbookName}
            placeholder="Enter logbook name"
            placeholderTextColor="#757575"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={isNameEmpty ? null : handleCreate}
          />
        </View>
        <View style={styles.modalButtonRow}>
          <TouchableOpacity
            style={modalStyles.modalNegativeButton}
            onPress={onClose}
          >
            <Text style={modalStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              modalStyles.modalPositiveButton,
              isNameEmpty && { opacity: 0.5 } // Make button appear disabled
            ]}
            onPress={handleCreate}
            disabled={isNameEmpty} // Disable the button when name is empty
          >
            <Text style={modalStyles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedModal>
  );
};

// Delete Logbook Modal
export const DeleteLogbookModal = ({ visible, onClose, selectedLogbook, onDelete }) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>Delete Logbook</Text>
      <Text style={[modalStyles.modalText, { textAlign: 'center' }]}>
        Are you sure you want to permanently delete the logbook <Text style={{ color: colors.primary, fontWeight: FONT_WEIGHT.EXTRA_BOLD }}>
          "{selectedLogbook?.title || 'Untitled'}"
        </Text>?
      </Text>
      <View style={styles.modalButtonRow}>
        <TouchableOpacity
          style={modalStyles.modalNegativeButton}
          onPress={onClose}
        >
          <Text style={modalStyles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={modalStyles.modalPositiveButton}
          onPress={() => {
            onDelete(selectedLogbook?.id);
            onClose(); // Close the modal immediately after delete is initiated
          }}
        >
          <Text style={modalStyles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </AnimatedModal>
);

// Logbooks Modal
export const LogbooksModal = ({ visible, onClose, logbooks, onSelect }) => {
  const screenHeight = Dimensions.get('window').height;

  return (
    <AnimatedModal visible={visible} onRequestClose={onClose}>
      <View style={[
        modalStyles.modalBox,
        {
          height: screenHeight * 0.7, // Set a fixed height based on screen height
          maxHeight: screenHeight * 0.85, // Add safety maximum
          paddingVertical: normalize(20)
        }
      ]}>
        <Text style={modalStyles.modalTitle}>Select Logbook</Text>

        {/* Container to make content take up available space but not overflow */}
        <View style={{
          flex: 1,
          width: '100%',
          maxHeight: screenHeight * 0.7 // Leave room for title and buttons
        }}>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: normalize(10) }}
            showsVerticalScrollIndicator={true}
          >
            {logbooks.map((logbook) => (
              <TouchableOpacity
                key={logbook.id}
                style={styles.modalOption}
                onPress={() => onSelect(logbook)}
              >
                <Text style={styles.modalOptionText}>{logbook.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[modalStyles.modalClose, { marginTop: normalize(10) }]}
          onPress={onClose}
        >
          <Text style={modalStyles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </AnimatedModal>
  );
};

// Imbalance Modal
export const ImbalanceModal = ({ visible, onClose, onProceed }) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>Matches may not be accurate</Text>
      <Text style={modalStyles.modalText}>
        Ensure an equal number of morning, afternoon, and evening measurements for more accurate results. Do you want to see your matches anyway?
      </Text>
      <View style={styles.modalButtonRow}>
        <TouchableOpacity
          style={modalStyles.modalNegativeButton}
          onPress={onClose}
        >
          <Text style={modalStyles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={modalStyles.modalPositiveButton}
          onPress={onProceed}
        >
          <Text style={modalStyles.buttonText}>Go!</Text>
        </TouchableOpacity>
      </View>
    </View>
  </AnimatedModal>
);

// Filter Modal
export const FilterModal = ({ type, title, visible, onClose, options, onSelect, onClear }) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>{title}</Text>
      <ScrollView style={modalStyles.modalScroll}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.modalOption}
            onPress={() => onSelect(option)}
          >
            <Text style={styles.modalOptionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={modalStyles.modalClose}
        onPress={onClear}
      >
        <Text style={modalStyles.buttonText}>Clear filter</Text>
      </TouchableOpacity>
    </View>
  </AnimatedModal>
);

export const ConfirmDeleteMeasurementModal = ({
  visible,
  onClose,
  onConfirm,
  timestamp,
  formatTimestamp,
  lux
}) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>Delete measurement</Text>
      <Text style={modalStyles.modalText}>
        Are you sure you want to delete the measurement from:
      </Text>
      {timestamp ? (
        <>
          <Text style={[modalStyles.modalText, {
            fontFamily: FONT_FAMILY.BOLD,
            fontWeight: FONT_WEIGHT.BOLD,
            marginVertical: normalize(10)
          }]}>
            {formatTimestamp(timestamp)}
          </Text>
          <Text style={modalStyles.modalText}>
            {lux} lux
          </Text>
        </>
      ) : (
        <Text style={modalStyles.modalText}>Loading measurement details...</Text>
      )}
      <View style={styles.modalButtonRow}>
        <TouchableOpacity
          style={modalStyles.modalNegativeButton}
          onPress={onClose}
        >
          <Text style={modalStyles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={modalStyles.modalPositiveButton}
          onPress={onConfirm}
          disabled={!timestamp}
        >
          <Text style={modalStyles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </AnimatedModal>
);

// No Matches After Measurement Modal
export const NoMatchesAfterMeasurementModal = ({ visible, onClose }) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>No plants found</Text>
      <Text style={modalStyles.modalText}>
        Sorry, we couldn't find any plants that match your criteria. Try adjusting your filters or taking a measurement in a different spot with more light.
      </Text>
      <TouchableOpacity
        style={modalStyles.modalClose}
        onPress={onClose}
      >
        <Text style={modalStyles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </AnimatedModal>
);

// No More Matches After Swiping Modal
export const NoMoreMatchesAfterSwipingModal = ({ visible, onClose }) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>No more matches</Text>
      <Text style={modalStyles.modalText}>
        You've swiped through all the plants for this spot. Take a new measurement or adjust your filters to find more matches.
      </Text>
      <TouchableOpacity
        style={modalStyles.modalClose}
        onPress={onClose}
      >
        <Text style={modalStyles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </AnimatedModal>
);

// Plant Detail Modal component
export const PlantDetailModal = ({
  visible,
  onClose,
  selectedPlant,
  toggleFavorite,
  favoritePlants
}) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <ScrollView contentContainerStyle={{ paddingBottom: normalize(20), alignItems: 'center' }} style={{ width: '100%' }}>
        {selectedPlant ? (
          <>
            {/* Plant Title */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: normalize(5),
            }}>
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={modalStyles.modalTitle}>{selectedPlant.name}</Text>
              </View>
              <TouchableOpacity
                style={{
                  marginTop: normalize(-8),
                  marginRight: normalize(5)
                }}
                onPress={() => toggleFavorite(selectedPlant)}
              >
                <Icon
                  name={favoritePlants.some((fav) => fav.name === selectedPlant.name) ? 'heart' : 'heart-outline'}
                  size={normalize(20)}
                  color={favoritePlants.some((fav) => fav.name === selectedPlant.name) ? colors.primary : colors.textDark}
                />
              </TouchableOpacity>
            </View>
            {/* Plant Details Card */}
            <View style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#97B598',
              borderRadius: 8,
              padding: normalize(15),
              width: '100%',
              marginBottom: normalize(20),
            }}>
              <PlantDetailRows plant={selectedPlant} />
            </View>
            {/* Close Button */}
            <TouchableOpacity style={modalStyles.modalClose} onPress={onClose}>
              <Text style={modalStyles.buttonText}>Close</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </View>
  </AnimatedModal>
);

// Helper component for rendering plant detail rows
const PlantDetailRows = ({ plant }) => {
  const renderDetailRow = (label, value) => (
    <>
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 0,
      }}>
        <Text style={[globalStyles.plantName, { width: normalize(100) }]}>{label}:</Text>
        <Text style={{
          fontSize: FONT_SIZE.MEDIUM,
          color: '#757575',
          fontFamily: FONT_FAMILY.REGULAR,
          flex: 1,
          marginLeft: normalize(10),
          textAlign: 'left',
          flexWrap: 'wrap',
        }}>{value}</Text>
      </View>
      <View style={{
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: normalize(10),
      }} />
    </>
  );

  const getDifficultyText = () => {
    switch (plant.loveLevel?.toLowerCase()) {
      case 'zero': return 'Easy';
      case 'some': return 'Medium';
      case 'lots of': return 'Hard';
      default: return plant.loveLevel || 'Unknown';
    }
  };

  const getPetSafeText = () => {
    return plant.petsafe
      ? 'Yes'
      : plant.petSafetyDetail
        ? `No, ${plant.petSafetyDetail}`
        : 'No';
  };

  const getTemperatureText = () => {
    return plant.tempMin && plant.tempMax
      ? `${plant.tempMin}-${plant.tempMax}°C`
      : 'Unknown';
  };

  return (
    <>
      {renderDetailRow('Light level', plant.lightLevel)}
      {renderDetailRow('Ideal', `${plant.thrivesMinLux} - ${plant.thrivesMaxLux} lux`)}
      {renderDetailRow('Tolerates', `${plant.growsWellMinLux} - ${plant.growsWellMaxLux} lux`)}
      {plant.survivesMinLux && renderDetailRow('Survives', `${plant.survivesMinLux} - ${plant.growsWellMinLux} lux`)}
      {plant.survivalNote && renderDetailRow('Survival note', plant.survivalNote)}
      {renderDetailRow('Height', plant.height)}
      {renderDetailRow('Watering', plant.waterRequirement)}
      {renderDetailRow('Temperature', getTemperatureText())}
      {renderDetailRow('Origin', plant.origin || 'Unknown')}
      {renderDetailRow('Difficulty', getDifficultyText())}
      {renderDetailRow('Love language', plant.loveLanguage || 'Unknown')}
      {renderDetailRow('Pet safe', getPetSafeText())}
    </>
  )
};