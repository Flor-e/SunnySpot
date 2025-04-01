// sunny-spot-swipe/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Load logbooks from AsyncStorage
export const loadLogbooks = async () => {
  try {
    const storedLogbooks = await AsyncStorage.getItem('logbooks');
    return storedLogbooks ? JSON.parse(storedLogbooks) : [];
  } catch (error) {
    console.error('Error loading logbooks:', error);
    return [];
  }
};

// Save logbooks to AsyncStorage
export const saveLogbooks = async (logbooks) => {
  try {
    await AsyncStorage.setItem('logbooks', JSON.stringify(logbooks));
    console.log('Saved logbooks:', logbooks); // Debug log
  } catch (error) {
    console.error('Error saving logbooks:', error);
  }
};

// Load favorite plants from AsyncStorage
export const loadFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem('favoritePlants');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

// Save favorite plants to AsyncStorage
export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem('favoritePlants', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

// Load the last selected logbook ID from AsyncStorage
export const loadLastSelectedLogbookId = async () => {
  try {
    const lastSelectedLogbookId = await AsyncStorage.getItem('lastSelectedLogbookId');
    return lastSelectedLogbookId || null;
  } catch (error) {
    console.error('Error loading last selected logbook ID:', error);
    return null;
  }
};

// Save the last selected logbook ID to AsyncStorage
export const saveLastSelectedLogbookId = async (logbookId) => {
  try {
    if (logbookId === null) {
      // If logbookId is null, remove the item from AsyncStorage
      await AsyncStorage.removeItem('lastSelectedLogbookId');
    } else {
      // Otherwise, save the logbookId
      await AsyncStorage.setItem('lastSelectedLogbookId', logbookId);
    }
  } catch (error) {
    console.error('Error saving last selected logbook ID:', error);
  }
};

// Load whether NerdMode has been opened before
export const loadNerdModeFirstOpen = async () => {
  try {
    const value = await AsyncStorage.getItem('nerdModeFirstOpen');
    return value === null; 
  } catch (error) {
    console.error('Error loading nerdModeFirstOpen:', error);
    return false;
  }
};

// Save whether Nerd Mode has been opened
export const saveNerdModeFirstOpen = async () => {
  try {
    await AsyncStorage.setItem('nerdModeFirstOpen', 'false');
  } catch (error) {
    console.error('Error saving nerdModeFirstOpen:', error);
  }
};

// Load whether NormalMode has been opened before
export const loadNormalModeFirstOpen = async () => {
  try {
    const value = await AsyncStorage.getItem('isNormalModeFirstOpen');
    return value === null; 
  } catch (error) {
    console.error('Error loading Normal Mode first open state:', error);
    return false;
  }
};

// Save whether NormalMode has been opened
export const saveNormalModeFirstOpen = async () => {
  try {
    await AsyncStorage.setItem('isNormalModeFirstOpen', 'false');
  } catch (error) {
    console.error('Error saving Normal Mode first open state:', error);
  }
};

// Load NormalMode filters from AsyncStorage
export const loadNormalModeFilters = async () => {
  try {
    const storedFilters = await AsyncStorage.getItem('normalModeFilters');
    return storedFilters ? JSON.parse(storedFilters) : null;
  } catch (error) {
    console.error('Error loading NormalMode filters:', error);
    return null;
  }
};

// NEW: Save NormalMode filters to AsyncStorage
export const saveNormalModeFilters = async (filters) => {
  try {
    await AsyncStorage.setItem('normalModeFilters', JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving NormalMode filters:', error);
  }
};

// NEW: Clear NormalMode filters from AsyncStorage
export const clearNormalModeFilters = async () => {
  try {
    await AsyncStorage.removeItem('normalModeFilters');
  } catch (error) {
    console.error('Error clearing NormalMode filters:', error);
  }
};