// sunny-spot-swipe/utils/plantAdvice.js
import plantsData from '../data/plants.json';

export { plantsData };

export const getLightLevel = (lux) => {
  if (!lux && lux !== 0) return 'Unknown';
  if (lux > 20000) return 'direct sunlight';
  if (lux > 10000) return 'bright light';
  if (lux > 2000) return 'medium light';
  if (lux > 500) return 'low light';
  return 'very low light';
};

export const getPlantsForLux = (lux, filters = {}, skipFilters = false) => {
  if (lux === null || lux === undefined) return [];

  // Step 1: Log the Plant Profile Filters
  console.log('Plant Profile Filters:', filters);

  // Step 2: Log the Measurement Taken
  console.log('Measurement Taken:', { lux });

  // Step 3: Find plants that match the lux value
  const luxmatchingPlants = plantsData
    .map((plant) => {
      const thrivesMatch = lux >= plant.thrivesMinLux && lux <= plant.thrivesMaxLux;
      const growsWellMatch = lux >= plant.growsWellMinLux && lux < plant.thrivesMinLux;

      let matchPercentage = 0;
      if (thrivesMatch) {
        matchPercentage = 100;
      } else if (growsWellMatch) {
        matchPercentage = 80;
      }

      return matchPercentage > 0 ? { ...plant, matchPercentage } : null;
    })
    .filter((plant) => plant !== null);

  // Log the plants that match the lux range (before applying filters)
  console.log('Plants Matching the Measurement:', luxmatchingPlants.map((plant) => plant.name));

  // If skipFilters is true, return the unfiltered list (used by usePlantAdvice for logging)
  if (skipFilters) {
    return luxmatchingPlants;
  }

  // Step 4: Log the filters being applied
  const appliedFilters = {};
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      appliedFilters[key] = filters[key];
    }
  });
  console.log('Filters Applied:', appliedFilters);

  // Step 5: Apply filters with normalized values
  const filteredPlants = luxmatchingPlants.filter((plant) => {
    const normalizedSize = filters.size ? filters.size.replace(/ \(.*\)/, '').toLowerCase() : '';
    const normalizedLooks = filters.looks ? filters.looks.toLowerCase() : '';
    const normalizedLoveLevel = filters.loveLevel ? filters.loveLevel.toLowerCase() : '';
    const normalizedWatering = filters.watering ? filters.watering.toLowerCase() : '';

    // Match against plant data (normalize plant data case as well)
    const sizeMatch = !filters.size || plant.size.toLowerCase() === normalizedSize;
    const looksMatch = !filters.looks || plant.looks.toLowerCase() === normalizedLooks;
    
    // Inclusive watering match
    const wateringMatch = !filters.watering || 
      (normalizedWatering === 'weekly' && ['weekly', 'bi-weekly', 'rarely'].includes(plant.waterRequirement.toLowerCase())) ||
      (normalizedWatering === 'bi-weekly' && ['bi-weekly', 'rarely'].includes(plant.waterRequirement.toLowerCase())) ||
      (normalizedWatering === 'rarely' && plant.waterRequirement.toLowerCase() === 'rarely');

    // Inclusive loveLevel match
    const loveLevelMatch = !filters.loveLevel || 
      (normalizedLoveLevel === 'lots of' && ['lots of', 'some', 'zero'].includes(plant.loveLevel.toLowerCase())) ||
      (normalizedLoveLevel === 'some' && ['some', 'zero'].includes(plant.loveLevel.toLowerCase())) ||
      (normalizedLoveLevel === 'zero' && plant.loveLevel.toLowerCase() === 'zero');

    const petsMatch = !filters.pets || (filters.pets === 'hell yeah!' ? plant.petsafe : !plant.petsafe);

    // Log why a plant was filtered out
    if (!sizeMatch) console.log(`Filtered out ${plant.name} due to size: ${plant.size} != ${normalizedSize}`);
    if (!looksMatch) console.log(`Filtered out ${plant.name} due to looks: ${plant.looks} != ${normalizedLooks}`);
    if (!loveLevelMatch) console.log(`Filtered out ${plant.name} due to loveLevel: ${plant.loveLevel} != ${normalizedLoveLevel} (inclusive check)`);
    if (!wateringMatch) console.log(`Filtered out ${plant.name} due to watering: ${plant.waterRequirement} != ${normalizedWatering} (inclusive check)`);
    if (!petsMatch) console.log(`Filtered out ${plant.name} due to pets: petsafe ${plant.petsafe} != ${filters.pets === 'hell yeah!' ? 'true' : 'false'}`);

    return sizeMatch && looksMatch && loveLevelMatch && wateringMatch && petsMatch;
  });

  // Step 6: Log the final plants shown to the user
  console.log('Plants Shown to the User:', filteredPlants.map((plant) => plant.name));

  return filteredPlants.sort((a, b) => b.matchPercentage - a.matchPercentage);
};