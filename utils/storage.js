import DatabaseService from './database';

// Light Sensor Hint
export const loadLightSensorHintFirstTime = async () => {
    return await DatabaseService.loadBooleanSetting('lightSensorHintFirstTime', true);
};

export const saveLightSensorHintShown = async () => {
    return await DatabaseService.saveBooleanSetting('lightSensorHintFirstTime', false);
};

// Nerd Mode First Open
export const loadNerdModeFirstOpen = async () => {
    return await DatabaseService.loadBooleanSetting('nerdModeFirstOpen', true);
};

export const saveNerdModeFirstOpen = async () => {
    return await DatabaseService.saveBooleanSetting('nerdModeFirstOpen', false);
};

// Normal Mode First Open
export const loadNormalModeFirstOpen = async () => {
    return await DatabaseService.loadBooleanSetting('normalModeFirstOpen', true);
};

export const saveNormalModeFirstOpen = async () => {
    return await DatabaseService.saveBooleanSetting('normalModeFirstOpen', false);
};

// Normal Mode Filters (kept in AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadNormalModeFilters = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@normalModeFilters');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Error loading normal mode filters:', e);
        return null;
    }
};

export const saveNormalModeFilters = async (filters) => {
    try {
        const jsonValue = JSON.stringify(filters);
        await AsyncStorage.setItem('@normalModeFilters', jsonValue);
    } catch (e) {
        console.error('Error saving normal mode filters:', e);
    }
};

export const clearNormalModeFilters = async () => {
    try {
        await AsyncStorage.removeItem('@normalModeFilters');
    } catch (e) {
        console.error('Error clearing normal mode filters:', e);
    }
};