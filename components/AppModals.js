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
    borderColor: '#97B598',
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
export const HistoryModal = ({ visible, onClose, selectedLogbook, deleteMeasurement, getTimeOfDay, getLightLevel }) => {
  const screenHeight = Dimensions.get('window').height;
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState(null);

  const styles = StyleSheet.create({
    modalContent: {
      flex: 1,
      paddingHorizontal: normalize(15),
    },
    timeOfDayTitle: {
      fontSize: FONT_SIZE.LARGE,
      fontFamily: FONT_FAMILY.BOLD,
      color: colors.textPrimary,
      textAlign: 'left',
      marginBottom: normalize(10),
      marginTop: normalize(10),
      paddingHorizontal: normalize(15),
    },
    divider: {
      height: 1,
      backgroundColor: colors.accentMedium,
      width: '75%',
      alignSelf: 'center',
      marginVertical: normalize(15),
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
    if (measurementToDelete) {
      deleteMeasurement(measurementToDelete.timestamp);
      setMeasurementToDelete(null);
      setConfirmDeleteVisible(false);
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

  // Memoize the grouped measurements to avoid repeated getTimeOfDay calls
  const groupedMeasurements = useMemo(() => {
    if (!selectedLogbook?.measurements?.length) return { morning: [], afternoon: [], evening: [] };
    const sortedMeasurements = [...selectedLogbook.measurements].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    return sortedMeasurements.reduce((acc, measurement) => {
      const tod = getTimeOfDay(measurement.timestamp);
      if (!acc[tod]) acc[tod] = [];
      acc[tod].push(measurement);
      return acc;
    }, { morning: [], afternoon: [], evening: [] });
  }, [selectedLogbook?.measurements, getTimeOfDay]);

  // Find the most recent measurement timestamp
  const findMostRecentTimestamp = useMemo(() => {
    if (!selectedLogbook?.measurements?.length) return null;
    const sortedMeasurements = [...selectedLogbook.measurements].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    return sortedMeasurements[0].timestamp;
  }, [selectedLogbook?.measurements]);

  // Function to format the timestamp as dd-mm-yyyy, hh:mm:ss
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <AnimatedModal visible={visible} onRequestClose={onClose}>
        <View style={[modalStyles.modalBox, { height: screenHeight * 0.85, paddingHorizontal: 0 }]}>
          <Text style={modalStyles.modalTitle}>Measurement History</Text>
          {selectedLogbook?.measurements?.length > 0 && (
            <FlatList
              data={['morning', 'afternoon', 'evening']}
              contentContainerStyle={styles.modalScrollContent}
              style={styles.modalContent}
              renderItem={({ item: timeOfDay }) => {
                const group = groupedMeasurements[timeOfDay];
                if (group.length === 0) return null;

                const mostRecentTimestamp = findMostRecentTimestamp;

                return (
                  <>
                    <Text style={styles.timeOfDayTitle}>
                      {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
                    </Text>
                    {group.map((measurement, index) => {
                      const isLatest = measurement.timestamp === mostRecentTimestamp;

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
                              {`${formatTimestamp(measurement.timestamp)} ${getTimeOfDay(
                                measurement.timestamp
                              )} ${getLightLevel(measurement.lux)} (${measurement.lux} lux)`}
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
                    })}
                    <View style={styles.divider} />
                  </>
                );
              }}
              keyExtractor={(item) => item}
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
        getTimeOfDay={getTimeOfDay}
        getLightLevel={getLightLevel}
        lux={measurementToDelete?.lux}
      />
    </>
  );
};

// Create Logbook Modal
export const CreateLogbookModal = ({ visible, onClose, newLogbookName, setNewLogbookName, onCreate }) => (
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
          style={modalStyles.modalPositiveButton}
          onPress={onCreate}
        >
          <Text style={modalStyles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  </AnimatedModal>
);

// Delete Logbook Modal
export const DeleteLogbookModal = ({ visible, onClose, selectedLogbook, onDelete }) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>Delete Logbook</Text>
      <Text style={modalStyles.modalText}>
        Are you sure you want to delete {selectedLogbook?.title || 'this logbook'}?
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
          onPress={onDelete}
        >
          <Text style={modalStyles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </AnimatedModal>
);

// Logbooks Modal
export const LogbooksModal = ({ visible, onClose, logbooks, onSelect }) => (
  <AnimatedModal visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.modalBox}>
      <Text style={modalStyles.modalTitle}>Select Logbook</Text>
      <ScrollView style={modalStyles.modalScroll}>
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
      <TouchableOpacity
        style={modalStyles.modalClose}
        onPress={onClose}
      >
        <Text style={modalStyles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </AnimatedModal>
);

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

// ConfirmDeleteMeasurementModal component with added safety checks and fixed font styling
export const ConfirmDeleteMeasurementModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  timestamp,
  formatTimestamp,
  getTimeOfDay,
  getLightLevel,
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
            {formatTimestamp(timestamp)} ({getTimeOfDay(timestamp)})
          </Text>
          <Text style={modalStyles.modalText}>
            {getLightLevel(lux)} ({lux} lux)
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
      {renderDetailRow('Height', plant.height)}
      {renderDetailRow('Watering', plant.waterRequirement)}
      {renderDetailRow('Temperature', getTemperatureText())}
      {renderDetailRow('Difficulty', getDifficultyText())}
      {renderDetailRow('Love language', plant.loveLanguage || 'Unknown')}
      {renderDetailRow('Pet safe', getPetSafeText())}
    </>
  );
};