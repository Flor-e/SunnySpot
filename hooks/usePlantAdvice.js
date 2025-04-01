// sunny-spot-swipe/hooks/usePlantAdvice.js
import { useState, useCallback } from 'react';
import { getLightLevel, getPlantsForLux } from '../utils/plantAdvice';

const usePlantAdvice = ({
  luxValue,
  getLux,
  filters,
  searchHistory,
  setSearchHistory,
  logbookName = 'Single Measurement',
  label = 'This Spot',
  onBeforeShowAdvice,
}) => {
  const [plantAdviceModalVisible, setPlantAdviceModalVisible] = useState(false);
  const [plantAdvice, setPlantAdvice] = useState(null);
  const [noMatchesAfterMeasurement, setNoMatchesAfterMeasurement] = useState(false); 
  const [noMoreMatchesAfterSwiping, setNoMoreMatchesAfterSwiping] = useState(false); 

  const showPlantAdvice = useCallback(async () => {
    const lux = luxValue !== undefined ? luxValue : typeof getLux === 'function' ? await getLux() : null;

    if (lux === null || lux <= 0) {
      setNoMatchesAfterMeasurement(true);
      setPlantAdviceModalVisible(false);
      return;
    }

    console.log('Plant Profile Filters:', filters);
    console.log('Measurement Taken:', { lux, logbookName });

    const plantsMatchingLux = getPlantsForLux(lux, {}, true);
    console.log('Plants Matching the Measurement:', plantsMatchingLux.map((plant) => plant.name));

    const appliedFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        appliedFilters[key] = filters[key];
      }
    });
    console.log('Filters Applied:', appliedFilters);

    const lightLevel = getLightLevel(lux) || 'Unknown';
    const recommendedPlants = getPlantsForLux(lux, filters) || [];

    if (recommendedPlants.length === 0) {
      setNoMatchesAfterMeasurement(true); // Set for no matches after measurement
      setNoMoreMatchesAfterSwiping(false); // Reset swiping state
      setPlantAdviceModalVisible(false);
      return;
    }

    const plantAdviceData = { lux, lightLevel, plants: recommendedPlants };
    setPlantAdvice(plantAdviceData);

    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    const searchEntry = {
      lux,
      lightLevel,
      plants: recommendedPlants,
      timestamp,
      logbookName,
    };
    setSearchHistory((prev) => [searchEntry, ...prev].slice(0, 5));
    setNoMatchesAfterMeasurement(false); // Reset measurement state
    setNoMoreMatchesAfterSwiping(false); // Reset swiping state
    setPlantAdviceModalVisible(true);
  }, [luxValue, getLux, filters, setSearchHistory, logbookName]);

  const triggerPlantAdvice = useCallback(async () => {
    if (onBeforeShowAdvice) {
      const canProceed = await onBeforeShowAdvice();
      if (!canProceed) return;
    }
    await showPlantAdvice();
  }, [onBeforeShowAdvice, showPlantAdvice]);

  return {
    plantAdviceModalVisible,
    setPlantAdviceModalVisible,
    plantAdvice,
    triggerPlantAdvice,
    showPlantAdvice,
    label,
    noMatchesAfterMeasurement,
    setNoMatchesAfterMeasurement,
    noMoreMatchesAfterSwiping,
    setNoMoreMatchesAfterSwiping,
  };
};

export default usePlantAdvice;