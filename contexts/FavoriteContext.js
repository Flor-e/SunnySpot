// contexts/FavoriteContext.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import { AppState } from 'react-native';
import DatabaseService from '../utils/database';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favoritePlants, setFavoritePlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract syncWithSQLite as a separate function
  // In FavoriteContext.js, modify the syncWithSQLite function
  const syncWithSQLite = async (favorites) => {
    try {
      // Make sure favorites is an array and not null/undefined
      if (!Array.isArray(favorites)) {
        return;
      }

      // Get database instance
      const db = await DatabaseService.initDB();

      // Use direct SQL for each plant - no transactions
      for (const plant of favorites) {
        if (!plant || !plant.name) continue;

        const plantJson = JSON.stringify(plant);

        try {
          // Use REPLACE to handle both insert and update
          await db.executeSql(
            'INSERT OR REPLACE INTO favorites (plant_name, plant_data) VALUES (?, ?)',
            [plant.name, plantJson]
          );
        } catch (e) {
        }
      }

      // Verify what's in the database
      const [results] = await db.executeSql('SELECT plant_name FROM favorites');
      const dbNames = [];
      for (let i = 0; i < results.rows.length; i++) {
        dbNames.push(results.rows.item(i).plant_name);
      }

      // Find plants to remove - plants in DB but not in favorites
      const memoryNames = favorites.map(p => p.name);
      const plantsToRemove = dbNames.filter(name => !memoryNames.includes(name));

      // Remove plants not in the favorites list
      for (const plantName of plantsToRemove) {
        await db.executeSql('DELETE FROM favorites WHERE plant_name = ?', [plantName]);
      }

      // Save database to ensure changes are persisted
      await DatabaseService.saveDatabase();
    } catch (error) {
      console.error('Error in direct sync:', error);
    }
  };

  // Load favorites when the app starts
  useEffect(() => {
    const initializeFavorites = async () => {
      setIsLoading(true);
      try {
        // Initialize the database
        await DatabaseService.initDB();

        // Get database info for debugging
        const dbInfo = await DatabaseService.getDatabaseInfo();

        // Get favorites from SQLite
        const sqliteFavorites = await DatabaseService.getFavorites();
        setFavoritePlants(sqliteFavorites);
      } catch (error) {
        console.error('Error initializing favorites:', error);
        setFavoritePlants([]);
      } finally {
        setIsLoading(false);
      }

      // Verify database persistence
      await DatabaseService.verifyDatabasePersistence();
    };

    initializeFavorites();

    // Clean up when component unmounts
    return () => {
      DatabaseService.closeDB();
    };
  }, []);

  // Single unified AppState listener for both background saving and foreground refresh
  useEffect(() => {
    // Handle app state changes
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {

        // Debug: Check what's in the database before sync
        const namesBeforeSync = await DatabaseService.getAllFavoriteNames();

        // Ensure all favorites are synced
        try {
          await syncWithSQLite(favoritePlants);

          // Debug: Check what's in the database after sync
          const namesAfterSync = await DatabaseService.getAllFavoriteNames();

          // Force an extra database save
          await DatabaseService.saveDatabase();
        } catch (error) {
          console.error('Error saving database before background:', error);
        }
      } else if (nextAppState === 'active') {

        // Reload favorites when app comes back to foreground
        try {
          const sqliteFavorites = await DatabaseService.getFavorites();

          // Only update state if there's a difference to avoid unnecessary re-renders
          if (JSON.stringify(sqliteFavorites) !== JSON.stringify(favoritePlants)) {
            setFavoritePlants(sqliteFavorites);
          }
        } catch (error) {
        }
      }
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Clean up the subscription
      subscription.remove();
    };
  }, [favoritePlants]);

  // Custom function to add a plant to favorites
  const addFavorite = async (plant) => {
    try {

      // Check current state before adding
      const existingNames = favoritePlants.map(p => p.name);

      const added = await DatabaseService.addFavorite(plant);
      if (added) {
        // Explicitly update state if not already there
        if (!existingNames.includes(plant.name)) {
          setFavoritePlants(prevFavorites => [...prevFavorites, plant]);
        } else {
        }

        // Verify database after adding
        const inDb = await DatabaseService.isFavorite(plant.name);

        // Force a sync to ensure consistency
        await syncWithSQLite([...favoritePlants, plant]);
      }
      return added;
    } catch (error) {
      return false;
    }
  };

  // Custom function to remove a plant from favorites
  const removeFavorite = async (plantName) => {
    try {

      // Save current state for verification
      const beforeRemove = favoritePlants.map(p => p.name);

      const removed = await DatabaseService.removeFavorite(plantName);
      if (removed) {
        // Update state
        setFavoritePlants(prevFavorites =>
          prevFavorites.filter(plant => plant.name !== plantName)
        );

        // Verify removal from database
        const stillInDb = await DatabaseService.isFavorite(plantName);

        // Get updated plants from state (after the filter)
        const updatedPlants = favoritePlants.filter(plant => plant.name !== plantName);
        await syncWithSQLite(updatedPlants);
      }
      return removed;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  };

  // Check if a plant is in favorites
  const isFavorite = async (plantName) => {
    return await DatabaseService.isFavorite(plantName);
  };

  // For bulk operations, like undo functionality
  const setFavoritePlantsDirectly = async (newFavorites) => {
    // If newFavorites is a function, call it with the current state to get the actual array
    if (typeof newFavorites === 'function') {
      setFavoritePlants((currentFavorites) => {
        const updatedFavorites = newFavorites(currentFavorites);
        // Sync the result with SQLite immediately (don't wait for background sync)
        (async () => {
          await syncWithSQLite(updatedFavorites);
          await DatabaseService.saveDatabase();
        })();
        return updatedFavorites;
      });
    } else {
      // It's a direct value, use it as is
      setFavoritePlants(newFavorites);
      // Sync immediately
      await syncWithSQLite(newFavorites);
      await DatabaseService.saveDatabase();
    }
  };

  return (
    <FavoriteContext.Provider value={{
      favoritePlants,
      addFavorite,
      removeFavorite,
      isFavorite,
      setFavoritePlants: setFavoritePlantsDirectly,
      isLoading
    }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}