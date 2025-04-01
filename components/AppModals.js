// AppModals.js - A collection of all modal components
import React, { useMemo, useState } from 'react'; 
import { Modal, View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles, { colors } from '../utils/globalStyles';

// Styling for modals
const styles = {
  modalOption: { 
    paddingVertical: 10, 
    alignItems: 'center' 
  },
  modalOptionText: { 
    fontSize: 16,
    fontFamily: 'NunitoSansRegular', 
    color: '#425f29' 
  },
  modalContent: { 
    width: '100%', 
    marginBottom: 15, 
    flex: 1 
  },
  modalButtonRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    width: '100%', 
    marginTop: 10, 
    gap: 10 
  },
  spotNameInput: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: '#97B598',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    fontFamily: 'NunitoSansRegular',
    alignSelf: 'center',
  },
};

// Lux Info Modal
export const LuxInfoModal = ({ visible, onClose }) => (
  <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>What is Lux?</Text>
        <ScrollView style={globalStyles.modalScroll}>
          <Text style={globalStyles.modalText}>
            <Text style={globalStyles.modalBoldText}>Lux measures light intensity.</Text> It shows how much light hits a surface, like your plant spot. Higher lux = brighter light.
          </Text>
          {[
            ['Very Low Light', '0–500 lux'],
            ['Low Light', '500–2.000 lux'],
            ['Medium Light', '2.000–10.000 lux'],
            ['Bright Light', '10.000–20.000 lux'],
            ['Direct Sunlight', '20.000+ lux'],
          ].map(([label, range]) => (
            <Text key={label} style={globalStyles.modalText}>
              <Text style={globalStyles.modalBoldText}>{label}:</Text> {range}
            </Text>
          ))}
        </ScrollView>
        <TouchableOpacity style={globalStyles.modalClose} onPress={onClose}>
          <Text style={globalStyles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// History Modal
export const HistoryModal = ({ visible, onClose, selectedLogbook, deleteMeasurement, getTimeOfDay, getLightLevel }) => {
  const screenHeight = Dimensions.get('window').height;
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState(null);

  const styles = StyleSheet.create({
    modalContent: {
      flex: 1,
      paddingHorizontal: 15,
    },
    timeOfDayTitle: {
      fontSize: 18,
      fontFamily: 'NunitoSansBold',
      color: colors.textPrimary,
      textAlign: 'left',
      marginBottom: 10,
      marginTop: 10,
      paddingHorizontal: 15,
    },
    divider: {
      height: 1,
      backgroundColor: colors.accentMedium,
      width: '75%',
      alignSelf: 'center',
      marginVertical: 15,
    },
    historyEntry: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 5,
      paddingVertical: 10,
      paddingHorizontal: 15,
      width: '95%',
      borderWidth: 1,
      borderRadius: 6,
      borderColor: colors.cardBorder,
    },
    historyTextContainer: {
      flex: 1,
      marginRight: 10,
    },
    historyText: {
      fontSize: 15,
      fontFamily: 'NunitoSansRegular',
      color: '#757575',
      flexWrap: 'wrap',
    },
    lastHistoryText: {
      fontSize: 16,
      fontFamily: 'NunitoSansRegular',
      fontWeight: 'bold',
      color: '#425f29',
      letterSpacing: 0.5,
    },
    trashIcon: {
      padding: 5,
    },
    modalScrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
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
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={[globalStyles.modalBox, { height: screenHeight * 0.85, paddingHorizontal: 0 }]}>
            <Text style={globalStyles.modalTitle}>Measurement History</Text>
            {selectedLogbook?.measurements?.length > 0 && (
              <FlatList
                data={['morning', 'afternoon', 'evening']}
                contentContainerStyle={styles.modalScrollContent}
                style={styles.modalContent}
                renderItem={({ item: timeOfDay }) => {
                  const group = groupedMeasurements[timeOfDay];
                  if (group.length === 0) return null;

                  const sortedMeasurements = [...selectedLogbook.measurements].sort(
                    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                  );

                  return (
                    <>
                      <Text style={styles.timeOfDayTitle}>
                        {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
                      </Text>
                      {group.map((measurement, index) => {
                        const isLast =
                          measurement.timestamp ===
                          sortedMeasurements[sortedMeasurements.length - 1].timestamp;

                        return (
                          <View
                            key={measurement.timestamp}
                            style={[
                              styles.historyEntry,
                              index % 2 === 0 ? styles.historyEntryOdd : styles.historyEntryEven,
                              isLast && { backgroundColor: 'transparent' },
                            ]}
                          >
                            <View style={styles.historyTextContainer}>
                              <Text
                                style={[styles.historyText, isLast && styles.lastHistoryText]}
                                numberOfLines={2}
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
                              <Icon name="trash-outline" size={18} color="#757575" />
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
            <TouchableOpacity style={globalStyles.modalClose} onPress={onClose}>
              <Text style={globalStyles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>Create New Logbook</Text>
        <View style={{ width: '100%', alignItems: 'center', paddingVertical: 20 }}>
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
            style={globalStyles.modalNegativeButton}
            onPress={onClose}
          >
            <Text style={globalStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.modalPositiveButton}
            onPress={onCreate}
          >
            <Text style={globalStyles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Delete Logbook Modal
export const DeleteLogbookModal = ({ visible, onClose, selectedLogbook, onDelete }) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>Delete Logbook</Text>
        <Text style={globalStyles.modalText}>
          Are you sure you want to delete {selectedLogbook?.title || 'this logbook'}?
        </Text>
        <View style={styles.modalButtonRow}>
          <TouchableOpacity
            style={globalStyles.modalNegativeButton}
            onPress={onClose}
          >
            <Text style={globalStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.modalPositiveButton}
            onPress={onDelete}
          >
            <Text style={globalStyles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Logbooks Modal
export const LogbooksModal = ({ visible, onClose, logbooks, onSelect }) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>Select Logbook</Text>
        <ScrollView style={globalStyles.modalScroll}>
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
          style={globalStyles.modalClose}
          onPress={onClose}
        >
          <Text style={globalStyles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Imbalance Modal
export const ImbalanceModal = ({ visible, onClose, onProceed }) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>Matches may not be accurate</Text>
        <Text style={globalStyles.modalText}>
          Ensure an equal number of morning, afternoon, and evening measurements for more accurate results. Do you want to see your matches anyway?
        </Text>
        <View style={styles.modalButtonRow}>
          <TouchableOpacity
            style={globalStyles.modalNegativeButton}
            onPress={onClose}
          >
            <Text style={globalStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.modalPositiveButton}
            onPress={onProceed}
          >
            <Text style={globalStyles.buttonText}>Go!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Filter Modal
export const FilterModal = ({ type, title, visible, onClose, options, onSelect, onClear }) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>{title}</Text>
        <ScrollView style={globalStyles.modalScroll}>
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
          style={globalStyles.modalClose}
          onPress={onClear}
        >
          <Text style={globalStyles.buttonText}>Clear filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ConfirmDeleteMeasurementModal component with added safety checks
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
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>Delete measurement</Text>
        <Text style={globalStyles.modalText}>
          Are you sure you want to delete the measurement from:
        </Text>
        {timestamp ? (
          <>
            <Text style={[globalStyles.modalText, { fontWeight: 'bold', marginVertical: 10 }]}>
              {formatTimestamp(timestamp)} ({getTimeOfDay(timestamp)})
            </Text>
            <Text style={globalStyles.modalText}>
              {getLightLevel(lux)} ({lux} lux)
            </Text>
          </>
        ) : (
          <Text style={globalStyles.modalText}>Loading measurement details...</Text>
        )}
        <View style={styles.modalButtonRow}>
          <TouchableOpacity
            style={globalStyles.modalNegativeButton}
            onPress={onClose}
          >
            <Text style={globalStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.modalPositiveButton}
            onPress={onConfirm}
            disabled={!timestamp}
          >
            <Text style={globalStyles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// No Matches After Measurement Modal
export const NoMatchesAfterMeasurementModal = ({ visible, onClose }) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>No plants match your criteria</Text>
        <Text style={globalStyles.modalText}>
          Sorry, we couldn’t find any plants that match your criteria. Try adjusting your filters or taking a measurement in a different spot with more light.
        </Text>
        <TouchableOpacity
          style={globalStyles.modalClose}
          onPress={onClose}
        >
          <Text style={globalStyles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// No More Matches After Swiping Modal
export const NoMoreMatchesAfterSwipingModal = ({ visible, onClose }) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalBox}>
        <Text style={globalStyles.modalTitle}>No more matches</Text>
        <Text style={globalStyles.modalText}>
          You’ve swiped through all the plants for this spot. Take a new measurement or adjust your filters to find more matches.
        </Text>
        <TouchableOpacity
          style={globalStyles.modalClose}
          onPress={onClose}
        >
          <Text style={globalStyles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);