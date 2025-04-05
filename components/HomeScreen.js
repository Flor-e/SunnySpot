import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  StatusBar,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { LightSensor } from 'expo-sensors';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles, { colors, normalize, FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, typography } from '../utils/globalStyles';

// Import content components
import NormalModeContent from './NormalModeContent';
import NerdModeContent from './NerdModeContent';

// Import modals
import { 
  LuxInfoModal, 
  HistoryModal, 
  CreateLogbookModal, 
  DeleteLogbookModal,
  LogbooksModal,
  ImbalanceModal,
  FilterModal,
  NoMatchesAfterMeasurementModal,
  NoMoreMatchesAfterSwipingModal,
} from './AppModals';

// Import other components
import PlantAdviceModal from './PlantAdviceModal';

// Import utility functions
import { getLightLevel, getTimeOfDay, calculateAverage } from '../utils/measurementUtils';
import { 
  loadLogbooks, 
  saveLogbooks, 
  loadLastSelectedLogbookId, 
  saveLastSelectedLogbookId, 
  saveNerdModeFirstOpen, 
  loadNerdModeFirstOpen,
  loadNormalModeFirstOpen,
  saveNormalModeFirstOpen,
  loadNormalModeFilters,   
  saveNormalModeFilters,  
  clearNormalModeFilters 
} from '../utils/storage';
import usePlantAdvice from '../hooks/usePlantAdvice';

export default function HomeScreen({ searchHistory, setSearchHistory }) {
  // State variables
  const [luxValue, setLuxValue] = useState(0);
  const [lightLevel, setLightLevel] = useState('Unknown');
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [measuredLux, setMeasuredLux] = useState(null);
  const [luxInfoModalVisible, setLuxInfoModalVisible] = useState(false);
  const [normalFilters, setNormalFilters] = useState({ size: '', looks: '', loveLevel: '', watering: '', pets: '' }); // Filters for NormalMode
  const [modalVisible, setModalVisible] = useState({
    size: false,
    looks: false,
    loveLevel: false,
    watering: false,
    pets: false,
    history: false,
    imbalance: false,
    createLogbook: false,
    deleteLogbook: false,
    logbooks: false,
  });
  const [nerdMode, setNerdMode] = useState(false);
  const [logbooks, setLogbooks] = useState([]);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [newLogbookName, setNewLogbookName] = useState('');
  const [instructionVisible, setInstructionVisible] = useState(false);
  const [slotCounts, setSlotCounts] = useState({ morning: 0, afternoon: 0, evening: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation values
  const pulseAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(-400))[0];

  // Constants for filter options
  const filterOptions = {
    size: ['small (<50 cm)', 'medium (50-100 cm)', 'large (>100 cm)', 'hanging'],
    looks: ['green', 'flowery', 'catching'],
    loveLevel: ['zero', 'some', 'lots of'],
    watering: ['weekly', 'bi-weekly', 'rarely'],
    pets: ['hell yeah!', 'nope'],
  };

  const filterTitles = {
    size: 'Select size',
    looks: 'Select looks',
    loveLevel: 'Select love level',
    watering: 'Select watering frequency',
    pets: 'Pets around?',
  };

  // Plant advice hooks
  const {
    plantAdviceModalVisible,
    setPlantAdviceModalVisible,
    plantAdvice,
    triggerPlantAdvice: triggerHomeAdvice,
    noMatchesAfterMeasurement: normalNoMatchesAfterMeasurement,
    setNoMatchesAfterMeasurement: setNormalNoMatchesAfterMeasurement,
    noMoreMatchesAfterSwiping: normalNoMoreMatchesAfterSwiping,
    setNoMoreMatchesAfterSwiping: setNormalNoMoreMatchesAfterSwiping,
  } = usePlantAdvice({
    getLux: async () => {
      if (isMeasuring) return null;
      setIsMeasuring(true);
      setCountdown(5);
      const tempReadings = [];

      await new Promise((resolve) => {
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev > 0) {
              tempReadings.push(luxValue);
              return prev - 1;
            }
            clearInterval(countdownInterval);
            resolve();
            return null;
          });
        }, 1000);
      });

      const avgLux = tempReadings.length ? Math.round(tempReadings.reduce((sum, val) => sum + val, 0) / tempReadings.length) : 0;
      setMeasuredLux(avgLux);
      setIsMeasuring(false);
      setCountdown(null);
      return avgLux;
    },
    filters: normalFilters, 
    searchHistory,
    setSearchHistory,
    logbookName: 'Single Measurement',
  });

  const {
    plantAdviceModalVisible: nerdPlantAdviceModalVisible,
    setPlantAdviceModalVisible: setNerdPlantAdviceModalVisible,
    plantAdvice: nerdPlantAdvice,
    triggerPlantAdvice: triggerNerdAdvice,
    showPlantAdvice,
    label,
    noMatchesAfterMeasurement: nerdNoMatchesAfterMeasurement,
    setNoMatchesAfterMeasurement: setNerdNoMatchesAfterMeasurement,
    noMoreMatchesAfterSwiping: nerdNoMoreMatchesAfterSwiping,
    setNoMoreMatchesAfterSwiping: setNerdNoMoreMatchesAfterSwiping,
  } = usePlantAdvice({
    luxValue: selectedLogbook?.average || 0,
    filters: selectedLogbook?.plantProfile || { size: '', looks: '', loveLevel: '', watering: '', pets: '' },
    searchHistory,
    setSearchHistory,
    logbookName: selectedLogbook?.title || 'Unknown Logbook',
    label: selectedLogbook?.title || 'This Spot',
    onBeforeShowAdvice: () => {
      if (!selectedLogbook?.measurements.length) {
        Alert.alert('No Measurements', 'Please add measurements first.');
        return false;
      }
      // Check for imbalance in measurements
      const { morning, afternoon, evening } = slotCounts;
      const isBalanced = morning === afternoon && afternoon === evening;
      if (!isBalanced) {
        setModalVisible(prev => ({ ...prev, imbalance: true }));
        return false;
      }
      return true; 
    },
  });

  // Load logbooks
  useEffect(() => {
    const initializeLogbooks = async () => {
      try {
        setIsLoading(true); 
        const storedLogbooks = await loadLogbooks();
  
        setLogbooks(storedLogbooks);
  
        const lastSelectedLogbookId = await loadLastSelectedLogbookId();
  
        if (storedLogbooks.length > 0) {
          const lastLogbook = storedLogbooks.find((lb) => lb.id === lastSelectedLogbookId);
  
          if (lastSelectedLogbookId && lastLogbook) {
            setSelectedLogbook(lastLogbook);
          } else {
            setSelectedLogbook(null);
            await saveLastSelectedLogbookId(null);
          }
        } else {
          setLogbooks([]);
          setSelectedLogbook(null);
          await saveLastSelectedLogbookId(null);
        }
      } catch (error) {
        console.error('Error in initializeLogbooks:', error);
      } finally {
        setIsLoading(false); 
      }
    };
  
    initializeLogbooks();
  }, []);

  // Save logbooks when changed
  useEffect(() => {
    if (logbooks.length > 0) {
      saveLogbooks(logbooks);
    }
  }, [logbooks]);

  // Initialize filters for NormalMode
  useEffect(() => {
    const initializeNormalFilters = async () => {
      if (!nerdMode) {
        const savedNormalFilters = await loadNormalModeFilters();
        if (savedNormalFilters) {
          setNormalFilters(savedNormalFilters);
        } else {
          setNormalFilters({ size: '', looks: '', loveLevel: '', watering: '', pets: '' });
        }
      }
    };
    
    initializeNormalFilters();
  }, [nerdMode]);

  // Save NormalMode filters when they change
  useEffect(() => {
    const saveNormalFilters = async () => {
      if (!nerdMode) {
        await saveNormalModeFilters(normalFilters);
      }
    };
    
    saveNormalFilters();
  }, [normalFilters, nerdMode]);

  // Update slot counts
  useEffect(() => {
    if (selectedLogbook) {
      const counts = { morning: 0, afternoon: 0, evening: 0 };
      selectedLogbook.measurements.forEach((m) => {
        const timeOfDay = getTimeOfDay(m.timestamp);
        if (timeOfDay !== 'unknown') {
          counts[timeOfDay]++;
        }
      });
      setSlotCounts(counts);
    }
  }, [selectedLogbook?.measurements]);

  // Save the selected logbook ID when it changes
  useEffect(() => {
    if (selectedLogbook) {
      saveLastSelectedLogbookId(selectedLogbook.id || null);
    }
  }, [selectedLogbook]);

  // Set up light sensor
  useEffect(() => {
    let subscription;
    LightSensor.isAvailableAsync()
      .then((available) => {
        if (available) {
          subscription = LightSensor.addListener(({ illuminance }) => {
            setLuxValue(Math.round(illuminance || 0));
            setLightLevel(getLightLevel(illuminance) || 'Unknown');
          });
          LightSensor.setUpdateInterval(1000);
        } else {
          setLightLevel('Light sensor not available');
        }
      })
      .catch((error) => setLightLevel(`Error: ${error.message}`));

    return () => subscription?.remove();
  }, []);

  // Animation setup
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(slideAnim, {
      toValue: instructionVisible ? normalize(70) : -400,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [pulseAnim, slideAnim, instructionVisible]);

  // Check NerdMode first open
  useEffect(() => {
    const checkNerdModeFirstOpen = async () => {
      const isFirstOpen = await loadNerdModeFirstOpen();
      if (isFirstOpen && nerdMode) {
        setInstructionVisible(true);
        await saveNerdModeFirstOpen();
      }
    };
    checkNerdModeFirstOpen();
  }, [nerdMode]);

  // Function to clear filters
  const clearFilters = async () => {
    if (nerdMode && selectedLogbook) {
      const emptyFilters = { size: '', looks: '', loveLevel: '', watering: '', pets: '' };
      const updatedLogbook = {
        ...selectedLogbook,
        plantProfile: emptyFilters
      };
      
      // Update the selected logbook locally
      setSelectedLogbook(updatedLogbook);
      
      // Update the logbook in the logbooks array
      setLogbooks(prev => 
        prev.map(lb => lb.id === selectedLogbook.id ? updatedLogbook : lb)
      );
    } else {
      // In NormalMode, clear filters and remove from storage
      await clearNormalModeFilters();
      setNormalFilters({ size: '', looks: '', loveLevel: '', watering: '', pets: '' });
    }
  };

  // Function to create a new logbook
  const createLogbook = () => {
    const title = newLogbookName.trim() || `Logbook ${logbooks.length + 1}`;
    const newLogbook = { 
      id: title, 
      title, 
      measurements: [], 
      average: 0, 
      plantProfile: { size: '', looks: '', loveLevel: '', watering: '', pets: '' }
    };
    setLogbooks([...logbooks, newLogbook]);
    setSelectedLogbook(newLogbook);
    setNewLogbookName('');
    setModalVisible(prev => ({ ...prev, createLogbook: false }));
  };

  const deleteLogbook = async () => {
    if (!selectedLogbook) return;
    
    const updatedLogbooks = logbooks.filter((lb) => lb.id !== selectedLogbook.id);
    
    // Update logbooks in state and storage
    setLogbooks(updatedLogbooks);
    await saveLogbooks(updatedLogbooks);
    
    // Reset selected logbook
    setSelectedLogbook(null);
    
    // Clear last selected logbook ID
    await saveLastSelectedLogbookId(null);
    
    setModalVisible(prev => ({ ...prev, deleteLogbook: false }));
  };

  // Function to take a measurement
  const takeMeasurement = () => {
    if (isMeasuring || !selectedLogbook) {
      if (!selectedLogbook) Alert.alert('No Logbook Selected', 'Please select a logbook first.');
      return;
    }
    setIsMeasuring(true);
    setCountdown(5);
    const readings = [];
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) {
          readings.push(luxValue);
          return prev - 1;
        }
        clearInterval(interval);
        const avgLux = Math.round(readings.reduce((sum, val) => sum + val, 0) / readings.length);
        const measurementDate = new Date();
        const newMeasurement = {
          number: selectedLogbook.measurements.length + 1,
          lux: avgLux,
          timestamp: measurementDate.toISOString(),
          displayTimestamp: measurementDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
        };
        setLogbooks((prev) => {
          const updatedLogbooks = prev.map((lb) =>
            lb.id === selectedLogbook.id
              ? { 
                  ...lb, 
                  measurements: [...lb.measurements, newMeasurement], 
                  average: calculateAverage(lb, avgLux) 
                }
              : lb
          );
          return updatedLogbooks;
        });
  
        setSelectedLogbook((prev) => {
          if (prev && prev.id === selectedLogbook.id) {
            return {
              ...prev,
              measurements: [...prev.measurements, newMeasurement],
              average: calculateAverage(prev, avgLux)
            };
          }
          return prev;
        });
  
        setIsMeasuring(false);
        return null;
      });
    }, 1000);
  };

  // Function to delete a measurement in HomeScreen.js
  const deleteMeasurement = (timestamp) => {
    if (!selectedLogbook) return;
    
    // Update the logbooks state
    setLogbooks((prev) => {
      const updatedLogbooks = prev.map((lb) => {
        if (lb.id === selectedLogbook.id) {
          const updatedMeasurements = lb.measurements.filter((m) => m.timestamp !== timestamp);
          const newAverage = updatedMeasurements.length
            ? Math.round(updatedMeasurements.reduce((sum, m) => sum + m.lux, 0) / updatedMeasurements.length)
            : 0;
          return { ...lb, measurements: updatedMeasurements, average: newAverage };
        }
        return lb;
      });
      return updatedLogbooks;
    });
    
    // Also update the selectedLogbook state directly to ensure UI updates immediately
    setSelectedLogbook((prev) => {
      if (!prev) return null;
      
      const updatedMeasurements = prev.measurements.filter((m) => m.timestamp !== timestamp);
      const newAverage = updatedMeasurements.length
        ? Math.round(updatedMeasurements.reduce((sum, m) => sum + m.lux, 0) / updatedMeasurements.length)
        : 0;
      
      return {
        ...prev,
        measurements: updatedMeasurements,
        average: newAverage
      };
    });
  };

  // Function to update filters for NerdMode (updates the selected logbook's plantProfile)
  const updateNerdFilters = (newFilters) => {
    if (nerdMode && selectedLogbook) {
      const updatedLogbook = {
        ...selectedLogbook,
        plantProfile: newFilters
      };
      
      // Update the selected logbook locally
      setSelectedLogbook(updatedLogbook);
      
      // Update the logbook in the logbooks array
      setLogbooks(prev => 
        prev.map(lb => lb.id === selectedLogbook.id ? updatedLogbook : lb)
      );
    }
  };

  if (isLoading) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.luxText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {/* Unified Header */}
      <View style={[globalStyles.headerSection, { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        zIndex: 30 
      }]}>
        {/* Left Side - Book Icon */}
        <TouchableOpacity onPress={() => setNerdMode((prev) => !prev)} style={styles.headerButton}>
          <View style={[
            globalStyles.headerIconButton, 
            { backgroundColor: colors.background, borderColor: colors.primary },
            nerdMode && { backgroundColor: colors.primary, borderColor: colors.primary }
          ]}>
            <Icon name="book-outline" size={normalize(20)} color={nerdMode ? colors.textLight : colors.textDark} />
          </View>
        </TouchableOpacity>
        
        {/* Center - Only visible in Nerd Mode */}
        {nerdMode ? (
          <View style={styles.headerCenter}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: normalize(36) }}>
              <TouchableOpacity 
                onPress={() => setModalVisible(prev => ({ ...prev, logbooks: true }))}
                disabled={!selectedLogbook && logbooks.length === 0}
              >
                <View style={[
                  styles.logbookDropdown, 
                  (!selectedLogbook && logbooks.length === 0) && { opacity: 1 }
                ]}>
                  <Text style={[globalStyles.filterDropdownText, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
                    {selectedLogbook?.title || (logbooks.length === 0 ? 'Create logbook' : 'Select Logbook')}
                  </Text>
                  <Icon 
                    name="chevron-down" 
                    size={normalize(12)} 
                    color={(!selectedLogbook && logbooks.length === 0) ? colors.textDisabled : colors.textPrimary} 
                    style={globalStyles.chevronIcon} 
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(prev => ({ ...prev, createLogbook: true }))}>
                <Icon name="add" size={normalize(20)} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        
        {/* Right side - empty to maintain layout since we moved the help button */}
        <View style={styles.headerButton} />
      </View>

      {/* Instruction Panel */}
      <Animated.View style={[globalStyles.instructionPanel, { transform: [{ translateY: slideAnim }] }]}>
        {/* Close instruction panel icon */}
        <TouchableOpacity 
          style={{
          position: 'absolute', 
         top: normalize(10), 
         right: normalize(10),
         zIndex: 50, // Ensure it's above other elements
         padding: normalize(10), // Increase touch area
         backgroundColor: 'transparent' // Optional: helps with touch detection
       }} 
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Increases touch area
        onPress={() => setInstructionVisible(false)}
      >
        <Icon 
          name="close-outline" 
          size={normalize(24)} 
         color={colors.textDark} 
        />
      </TouchableOpacity>

        <Text style={globalStyles.instructionPanelTitle}>
          {nerdMode ? 'Welcome to logbook mode!' : 'How to find your plant match?'}
        </Text>
        {nerdMode ? (
          <>
            <Text style={globalStyles.instructionPanelText}>
            ☀️ Light changes during the day and one measurement might not be accurate enough to pick the perfect plant. So for all you plant nerds out there, there's logbook mode.
            </Text>
            <Text style={globalStyles.instructionPanelText}>
              Log multiple measurements throughout the day, on one day, or several. For an accurate result, make sure you have an equal amount of morning, afternoon, and evening measurements. 🕰️
            </Text>
          </>
        ) : (
          <>
            <Text style={globalStyles.instructionPanelText}>
              Stand where your plant will go and point your phone's light sensor at the nearest window. Tap to start a 5 second measurement. 🌿
            </Text>
            <Text style={globalStyles.instructionPanelText}>
              💡 The light sensor is usually near your phone's front camera. Cover it with your hand. Does the lux value go to (near) zero? Yay, you've found it!
            </Text>
            <Text style={globalStyles.instructionPanelText}>
              For best results, measure at a moment that's not too shady or sunny, and at the time when your plant will soak up most of its light. ☀️
            </Text>
          </>
        )}
      </Animated.View>

      {/* Main Content - Switch between modes */}
      {nerdMode ? (
        <NerdModeContent
          selectedLogbook={selectedLogbook}
          filters={selectedLogbook?.plantProfile || { size: '', looks: '', loveLevel: '', watering: '', pets: '' }} 
          setFilters={updateNerdFilters} 
          slotCounts={slotCounts}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          clearFilters={clearFilters}
          triggerPlantAdvice={triggerNerdAdvice}
          getLightLevel={getLightLevel}
          getTimeOfDay={getTimeOfDay}
          logbooks={logbooks}
        />
      ) : (
        <NormalModeContent
          filters={normalFilters} 
          setFilters={setNormalFilters} 
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          clearFilters={clearFilters}
          filterOptions={filterOptions}
        />
      )}

      {/* Bottom Section */}
{nerdMode ? (
  <View style={globalStyles.bottomSection}>
    <Animated.View 
      style={[
        globalStyles.measureButton, 
        logbooks.length === 0 && globalStyles.logbookDisabledButton,
        logbooks.length > 0 && { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <TouchableOpacity 
        onPress={takeMeasurement} 
        disabled={isMeasuring || logbooks.length === 0}
      >
        {isMeasuring && countdown !== null ? (
          <Text style={globalStyles.countdownText}>{countdown}</Text>
        ) : (
          <Icon name="flash-outline" size={normalize(50)} color={colors.textLight} />
        )}
      </TouchableOpacity>
    </Animated.View>
    <View style={styles.helpButtonContainer}>
  <Text style={globalStyles.buttonLabel}>
    {isMeasuring ? 'Measuring...' : 'Take light measurement'}
  </Text>
  <TouchableOpacity 
    style={styles.helpBadge}
    onPress={() => setInstructionVisible((prev) => !prev)}
  >
    <Text style={styles.helpBadgeText}>Help</Text>
  </TouchableOpacity>
</View>
    <View style={globalStyles.luxDisplay}>
      <View style={globalStyles.luxRow}>
        <Text style={globalStyles.luxText}>{luxValue} lux</Text>
        <TouchableOpacity onPress={() => setLuxInfoModalVisible(true)}>
          <Icon name="information-circle-outline" size={normalize(16)} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={globalStyles.lightLevelText}>{getLightLevel(luxValue) || 'Unknown'}</Text>
    </View>
  </View>
) : (
  <View style={globalStyles.bottomSection}>
    <Animated.View style={[globalStyles.measureButton, { transform: [{ scale: pulseAnim }], opacity: isMeasuring ? 0.5 : 1 }]}>
      <TouchableOpacity onPress={triggerHomeAdvice} disabled={isMeasuring}>
        {isMeasuring && countdown !== null ? (
          <Text style={globalStyles.countdownText}>{countdown}</Text>
        ) : (
          <Icon name="leaf-outline" size={normalize(50)} color={colors.textLight} />
        )}
      </TouchableOpacity>
    </Animated.View>
    <View style={styles.helpButtonContainer}>
  <Text style={globalStyles.buttonLabel}>
    {isMeasuring ? 'Measuring...' : 'Tap to find match'}
  </Text>
  <TouchableOpacity 
    style={styles.helpBadge}
    onPress={() => setInstructionVisible((prev) => !prev)}
  >
    <Text style={styles.helpBadgeText}>Help</Text>
  </TouchableOpacity>
</View>
    <View style={globalStyles.luxDisplay}>
      <View style={globalStyles.luxRow}>
        <Text style={globalStyles.luxText}>{luxValue} lux</Text>
        <TouchableOpacity onPress={() => setLuxInfoModalVisible(true)}>
          <Icon name="information-circle-outline" size={normalize(16)} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={globalStyles.lightLevelText}>{lightLevel.trim()}</Text>
    </View>
  </View>
)}

      {/* Modals */}
      <LuxInfoModal 
        visible={luxInfoModalVisible} 
        onClose={() => setLuxInfoModalVisible(false)} 
      />

      <HistoryModal 
        visible={modalVisible.history} 
        onClose={() => setModalVisible(prev => ({ ...prev, history: false }))} 
        selectedLogbook={selectedLogbook}
        deleteMeasurement={deleteMeasurement}
        getTimeOfDay={getTimeOfDay}
        getLightLevel={getLightLevel}
      />

      <CreateLogbookModal 
        visible={modalVisible.createLogbook}
        onClose={() => setModalVisible(prev => ({ ...prev, createLogbook: false }))}
        newLogbookName={newLogbookName}
        setNewLogbookName={setNewLogbookName}
        onCreate={createLogbook}
      />

      <DeleteLogbookModal 
        visible={modalVisible.deleteLogbook}
        onClose={() => setModalVisible(prev => ({ ...prev, deleteLogbook: false }))}
        selectedLogbook={selectedLogbook}
        onDelete={deleteLogbook}
      />

      <LogbooksModal 
        visible={modalVisible.logbooks}
        onClose={() => setModalVisible(prev => ({ ...prev, logbooks: false }))}
        logbooks={logbooks}
        onSelect={(logbook) => {
          setSelectedLogbook(logbook);
          setModalVisible(prev => ({ ...prev, logbooks: false }));
        }}
      />

      <ImbalanceModal 
        visible={modalVisible.imbalance}
        onClose={() => setModalVisible(prev => ({ ...prev, imbalance: false }))}
        onProceed={() => {
          showPlantAdvice();
          setModalVisible(prev => ({ ...prev, imbalance: false }));
        }}
      />

{Object.keys(filterOptions).map((type) => (
  <FilterModal
    key={type}
    type={type}
    title={filterTitles[type]}
    visible={modalVisible[type]}
    onClose={() => setModalVisible(prev => ({ ...prev, [type]: false }))}
    options={filterOptions[type]}
    onSelect={(option) => {
      if (nerdMode && selectedLogbook) {
        // In NerdMode, update the selected logbook's plantProfile
        const updatedPlantProfile = {
          ...(selectedLogbook?.plantProfile || { size: '', looks: '', loveLevel: '', watering: '', pets: '' }),
          [type]: option,
        };
        
        // Update the selected logbook using the updateNerdFilters function
        updateNerdFilters(updatedPlantProfile);
      } else {
        // In NormalMode, update normalFilters
        setNormalFilters(prev => ({ ...prev, [type]: option }));
      }
      setModalVisible(prev => ({ ...prev, [type]: false }));
    }}
    onClear={() => {
      if (nerdMode && selectedLogbook) {
        // In NerdMode, clear the specific filter in the selected logbook's plantProfile
        const updatedPlantProfile = {
          ...(selectedLogbook?.plantProfile || { size: '', looks: '', loveLevel: '', watering: '', pets: '' }),
          [type]: '',
        };
        
        // Update the selected logbook using the updateNerdFilters function
        updateNerdFilters(updatedPlantProfile);
      } else {
        // In NormalMode, clear the specific filter
        setNormalFilters(prev => ({ ...prev, [type]: '' }));
      }
      setModalVisible(prev => ({ ...prev, [type]: false }));
    }}
  />
))}

      <PlantAdviceModal
        visible={nerdMode ? nerdPlantAdviceModalVisible : plantAdviceModalVisible}
        plantAdvice={nerdMode ? nerdPlantAdvice : plantAdvice}
        filters={nerdMode ? (selectedLogbook?.plantProfile || { size: '', looks: '', loveLevel: '', watering: '', pets: '' }) : normalFilters}
        onClose={() => nerdMode ? setNerdPlantAdviceModalVisible(false) : setPlantAdviceModalVisible(false)}
        label={nerdMode ? (selectedLogbook?.title || 'Measured') : 'Measured'}
      />

      {/* Add the new modals here */}
      <NoMatchesAfterMeasurementModal
        visible={nerdMode ? nerdNoMatchesAfterMeasurement : normalNoMatchesAfterMeasurement}
        onClose={() => {
          if (nerdMode) {
            setNerdNoMatchesAfterMeasurement(false);
          } else {
            setNormalNoMatchesAfterMeasurement(false);
          }
        }}
      />

      <NoMoreMatchesAfterSwipingModal
        visible={nerdMode ? nerdNoMoreMatchesAfterSwiping : normalNoMoreMatchesAfterSwiping}
        onClose={() => {
          if (nerdMode) {
            setNerdNoMoreMatchesAfterSwiping(false);
          } else {
            setNormalNoMoreMatchesAfterSwiping(false);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginHorizontal: normalize(10),
    paddingVertical: 0,
    width: normalize(36), // Ensure consistent layout with both sides
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: normalize(36),
  },
  logbookDropdown: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: normalize(170),
    height: normalize(36),
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(6),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  createButton: {
    width: normalize(40),
    height: normalize(36),
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -2,
  },
  navDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    marginHorizontal: normalize(4),
  },
  helpButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpBadge: {
    marginTop: normalize(5),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(4),
    backgroundColor: colors.accent,
    borderRadius: normalize(8),
  },
  helpBadgeText: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
});