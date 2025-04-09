// utils/database.js
import SQLite from 'react-native-sqlite-storage';

// Initialize the database
SQLite.enablePromise(true);

const DATABASE_NAME = 'SunnySpotSwipe.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAY_NAME = 'Sunny Spot Swipe Database';
const DATABASE_SIZE = 200000;

export default class DatabaseService {
    static dbInstance = null;

    // Initialize the database connection
    static async initDB() {
        if (this.dbInstance) {
            return this.dbInstance;
        }

        try {
            this.dbInstance = await SQLite.openDatabase({
                name: DATABASE_NAME,
                location: 'default',
                dblocation: 'nosync', // Try this for iOS
            });

            // Verify database is opened
            const [testResult] = await this.dbInstance.executeSql('SELECT name FROM sqlite_master LIMIT 1');

            // Check the database path

            // Create tables (only after initialization)
            await this.createTables();

            return this.dbInstance;
        } catch (error) {
            console.error('Error initializing the database:', error);
            console.error('Full error details:', JSON.stringify(error));
            throw error;
        }
    }

    // Create tables if they don't exist
    static async createTables() {
        // Don't call initDB() here again - it would create a loop
        // Just use the instance
        if (!this.dbInstance) {
            console.error('Database not initialized before creating tables');
            return;
        }

        try {
            // Enable foreign key support
            await this.dbInstance.executeSql('PRAGMA foreign_keys = ON;');

            // Create Favorites table
            await this.dbInstance.executeSql(`
                CREATE TABLE IF NOT EXISTS favorites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    plant_name TEXT NOT NULL UNIQUE,
                    plant_data TEXT NOT NULL,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create Logbooks table
            await this.dbInstance.executeSql(`
                CREATE TABLE IF NOT EXISTS logbooks (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    average INTEGER DEFAULT 0,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create Measurements table
            await this.dbInstance.executeSql(`
                CREATE TABLE IF NOT EXISTS measurements (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    logbook_id TEXT NOT NULL,
                    number INTEGER NOT NULL,
                    lux INTEGER NOT NULL,
                    timestamp TEXT NOT NULL,
                    display_timestamp TEXT NOT NULL,
                    FOREIGN KEY (logbook_id) REFERENCES logbooks(id) ON DELETE CASCADE
                )
            `);

            // Create Logbook preferences table
            await this.dbInstance.executeSql(`
                CREATE TABLE IF NOT EXISTS logbook_preferences (
                    logbook_id TEXT PRIMARY KEY,
                    size TEXT DEFAULT '',
                    looks TEXT DEFAULT '',
                    love_level TEXT DEFAULT '',
                    watering TEXT DEFAULT '',
                    pets TEXT DEFAULT '',
                    FOREIGN KEY (logbook_id) REFERENCES logbooks(id) ON DELETE CASCADE
                )
            `);

            // Create App settings table
            await this.dbInstance.executeSql(`
                CREATE TABLE IF NOT EXISTS app_settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            `);

        } catch (error) {
            console.error('Error creating tables:', error);
            throw error;
        }
    }

    // Get the last selected logbook ID from app settings
    static async getLastSelectedLogbookId() {
        const db = await this.initDB();

        try {

            // First, log all app settings to see what's stored
            const [allSettingsResult] = await db.executeSql('SELECT * FROM app_settings');
            for (let i = 0; i < allSettingsResult.rows.length; i++) {
            }

            const [result] = await db.executeSql(
                'SELECT value FROM app_settings WHERE key = ?',
                ['lastSelectedLogbookId']
            );

            if (result.rows.length > 0) {
                const id = result.rows.item(0).value;
                console.log('DatabaseService: Found lastSelectedLogbookId:', id);
                return id;
            }
            console.log('DatabaseService: No lastSelectedLogbookId found in database');
            return null;
        } catch (error) {
            console.error('Error getting last selected logbook ID:', error);
            console.error('Detailed error:', JSON.stringify(error));
            return null;
        }
    }

    // Close the database connection
    static async closeDB() {
        if (this.dbInstance) {
            try {
                // Check if any transactions are in progress
                const [result] = await this.dbInstance.executeSql('SELECT 1');
                await this.dbInstance.close();
                this.dbInstance = null;
            } catch (error) {
                console.error('Error closing database:', error);
                // If we can't close properly, set instance to null anyway
                this.dbInstance = null;
            }
        }
    }

    // Get all favorite plants
    static async getFavorites() {
        const db = await this.initDB();

        try {
            const [results] = await db.executeSql('SELECT * FROM favorites ORDER BY created_at DESC');

            const favoritePlants = [];

            for (let i = 0; i < results.rows.length; i++) {
                const item = results.rows.item(i);
                // Parse the stored JSON data
                try {
                    const plantData = JSON.parse(item.plant_data);
                    favoritePlants.push(plantData);
                } catch (e) {
                    console.error(`Error parsing plant data for ${item.plant_name}:`, e);
                }
            }

            return favoritePlants;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }
    }

    // Get all logbooks with their measurements and preferences
    static async getLogbooks() {
        const db = await this.initDB();

        try {
            // Get all logbooks
            const [logbooksResult] = await db.executeSql('SELECT * FROM logbooks ORDER BY created_at DESC');
            const logbooks = [];

            // For each logbook, get its measurements and preferences
            for (let i = 0; i < logbooksResult.rows.length; i++) {
                const logbook = logbooksResult.rows.item(i);

                // Get measurements
                const [measurementsResult] = await db.executeSql(
                    'SELECT * FROM measurements WHERE logbook_id = ? ORDER BY number ASC',
                    [logbook.id]
                );

                const measurements = [];
                for (let j = 0; j < measurementsResult.rows.length; j++) {
                    measurements.push(measurementsResult.rows.item(j));
                }

                // Get preferences
                const [prefsResult] = await db.executeSql(
                    'SELECT * FROM logbook_preferences WHERE logbook_id = ?',
                    [logbook.id]
                );

                let plantProfile = { size: '', looks: '', loveLevel: '', watering: '', pets: '' };
                if (prefsResult.rows.length > 0) {
                    const prefs = prefsResult.rows.item(0);
                    plantProfile = {
                        size: prefs.size || '',
                        looks: prefs.looks || '',
                        loveLevel: prefs.love_level || '',
                        watering: prefs.watering || '',
                        pets: prefs.pets || ''
                    };
                }

                // Combine into a complete logbook object
                logbooks.push({
                    id: logbook.id,
                    title: logbook.title,
                    measurements,
                    average: logbook.average,
                    plantProfile
                });
            }

            return logbooks;
        } catch (error) {
            console.error('Error getting logbooks:', error);
            return [];
        }
    }

    // Create or update a logbook
    static async saveLogbook(logbook) {
        if (!logbook || !logbook.id) {
            console.error('Invalid logbook object:', logbook);
            return false;
        }

        const db = await this.initDB();

        try {
            // First, check existing measurements
            const [existingMeasurementsResult] = await db.executeSql(
                'SELECT * FROM measurements WHERE logbook_id = ? ORDER BY number ASC',
                [logbook.id]
            );

            // Insert or replace the logbook
            const [result] = await db.executeSql(
                'INSERT OR REPLACE INTO logbooks (id, title, average) VALUES (?, ?, ?)',
                [logbook.id, logbook.title, logbook.average || 0]
            );

            // Preserve or update measurements
            if ((!logbook.measurements || logbook.measurements.length === 0) &&
                existingMeasurementsResult.rows.length > 0) {

                // Reinsert existing measurements
                for (let i = 0; i < existingMeasurementsResult.rows.length; i++) {
                    const existingMeasurement = existingMeasurementsResult.rows.item(i);
                    await db.executeSql(
                        'INSERT OR REPLACE INTO measurements (logbook_id, number, lux, timestamp, display_timestamp) VALUES (?, ?, ?, ?, ?)',
                        [
                            logbook.id,
                            existingMeasurement.number,
                            existingMeasurement.lux,
                            existingMeasurement.timestamp,
                            existingMeasurement.display_timestamp || ''  // Provide a default empty string
                        ]
                    );
                }
            } else if (logbook.measurements && logbook.measurements.length > 0) {
                // If new measurements are provided, save them
                for (const measurement of logbook.measurements) {
                    await db.executeSql(
                        'INSERT OR REPLACE INTO measurements (logbook_id, number, lux, timestamp, display_timestamp) VALUES (?, ?, ?, ?, ?)',
                        [
                            logbook.id,
                            measurement.number,
                            measurement.lux,
                            measurement.timestamp,
                            measurement.displayTimestamp || ''  // Provide a default empty string
                        ]
                    );
                }
            }

            // Insert or replace preferences
            const [prefsResult] = await db.executeSql(
                'INSERT OR REPLACE INTO logbook_preferences (logbook_id, size, looks, love_level, watering, pets) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    logbook.id,
                    logbook.plantProfile?.size || '',
                    logbook.plantProfile?.looks || '',
                    logbook.plantProfile?.loveLevel || '',
                    logbook.plantProfile?.watering || '',
                    logbook.plantProfile?.pets || ''
                ]
            );

            // Save database immediately
            await this.saveDatabase();
            return true;
        } catch (error) {
            console.error(`Error saving logbook ${logbook.id}:`, error);
            console.error('Full error details:', JSON.stringify(error));
            return false;
        }
    }

    // Add a measurement to a logbook
    static async addMeasurement(logbookId, measurement) {
        if (!logbookId || !measurement) {
            console.error('Invalid measurement data:', { logbookId, measurement });
            return false;
        }

        const db = await this.initDB();

        try {
            // First, get the current measurements to determine the next number
            const [existingMeasurementsResult] = await db.executeSql(
                'SELECT * FROM measurements WHERE logbook_id = ? ORDER BY number DESC LIMIT 1',
                [logbookId]
            );

            let nextNumber = 1;
            if (existingMeasurementsResult.rows.length > 0) {
                nextNumber = existingMeasurementsResult.rows.item(0).number + 1;
            }

            // Insert the new measurement
            await db.executeSql(
                'INSERT INTO measurements (logbook_id, number, lux, timestamp, display_timestamp) VALUES (?, ?, ?, ?, ?)',
                [
                    logbookId,
                    measurement.number || nextNumber,
                    measurement.lux,
                    measurement.timestamp,
                    measurement.displayTimestamp || ''
                ]
            );

            // Update the average in the logbook
            const [avgResult] = await db.executeSql(
                'SELECT AVG(lux) as average FROM measurements WHERE logbook_id = ?',
                [logbookId]
            );

            const newAverage = avgResult.rows.length > 0 ? Math.round(avgResult.rows.item(0).average || 0) : 0;

            await db.executeSql(
                'UPDATE logbooks SET average = ? WHERE id = ?',
                [newAverage, logbookId]
            );

            // Save database immediately
            await this.saveDatabase();

            return true;
        } catch (error) {
            console.error(`Error adding measurement to logbook ${logbookId}:`, error);
            console.error('Detailed error details:', JSON.stringify(error));
            return false;
        }
    }

    // Delete a logbook and its related data
    static async deleteLogbook(logbookId) {
        const db = await this.initDB();

        try {
            // Check if the logbook exists before deletion
            const [checkResult] = await db.executeSql(
                'SELECT * FROM logbooks WHERE id = ?',
                [logbookId]
            );

            if (checkResult.rows.length === 0) {
                console.error(`Logbook with ID ${logbookId} not found`);
                return false;
            }

            // Log the number of measurements and preferences
            const [measurementsCount] = await db.executeSql(
                'SELECT COUNT(*) as count FROM measurements WHERE logbook_id = ?',
                [logbookId]
            );
            const [preferencesCount] = await db.executeSql(
                'SELECT COUNT(*) as count FROM logbook_preferences WHERE logbook_id = ?',
                [logbookId]
            );

            // Delete the logbook (measurements and preferences will be deleted via CASCADE)
            const [deleteResult] = await db.executeSql(
                'DELETE FROM logbooks WHERE id = ?',
                [logbookId]
            );

            // Save database immediately
            await this.saveDatabase();
            return deleteResult.rowsAffected > 0;
        } catch (error) {
            console.error(`Detailed error deleting logbook ${logbookId}:`, {
                errorMessage: error.message,
                errorStack: error.stack
            });
            return false;
        }
    }

    // Delete a measurement from a logbook
    static async deleteMeasurement(logbookId, timestamp) {
        if (!logbookId || !timestamp) {
            console.error('Invalid measurement data for deletion:', { logbookId, timestamp });
            return false;
        }

        const db = await this.initDB();

        try {
            // First, verify the measurement exists
            const [checkResult] = await db.executeSql(
                'SELECT * FROM measurements WHERE logbook_id = ? AND timestamp = ?',
                [logbookId, timestamp]
            );

            if (checkResult.rows.length === 0) {
                console.error('No measurement found with given logbook ID and timestamp', { logbookId, timestamp });
                return false;
            }

            // Delete the measurement
            await db.executeSql(
                'DELETE FROM measurements WHERE logbook_id = ? AND timestamp = ?',
                [logbookId, timestamp]
            );

            // Update the average
            const [avgResult] = await db.executeSql(
                'SELECT AVG(lux) as average FROM measurements WHERE logbook_id = ?',
                [logbookId]
            );

            const newAverage = avgResult.rows.length > 0 ? Math.round(avgResult.rows.item(0).average || 0) : 0;

            await db.executeSql(
                'UPDATE logbooks SET average = ? WHERE id = ?',
                [newAverage, logbookId]
            );

            // Save database immediately
            await this.saveDatabase();

            return true;
        } catch (error) {
            console.error(`Error deleting measurement from logbook ${logbookId}:`, error);
            console.error('Detailed error details:', JSON.stringify(error));
            return false;
        }
    }

    // Save/retrieve last selected logbook
    static async saveLastSelectedLogbookId(logbookId) {
        const db = await this.initDB();

        try {

            if (logbookId === null) {
                await db.executeSql(
                    'DELETE FROM app_settings WHERE key = ?',
                    ['lastSelectedLogbookId']
                );
            } else {
                await db.executeSql(
                    'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
                    ['lastSelectedLogbookId', logbookId]
                );

                // Verify the save worked
                const [verifyResult] = await db.executeSql(
                    'SELECT value FROM app_settings WHERE key = ?',
                    ['lastSelectedLogbookId']
                );
                if (verifyResult.rows.length > 0) {
                    console.log('DatabaseService: Verified save - ID in database:', verifyResult.rows.item(0).value);
                } else {
                    console.log('DatabaseService: Save verification failed - no ID found in database');
                }
            }

            await this.saveDatabase();
            return true;
        } catch (error) {
            console.error('Error saving last selected logbook ID:', error);
            return false;
        }
    }

    // Add a plant to favorites
    static async addFavorite(plant) {
        if (!plant || typeof plant !== 'object' || !plant.name) {
            console.error('Invalid plant object:', plant);
            return false;
        }

        const db = await this.initDB();

        try {
            // Convert plant to JSON
            const plantJson = JSON.stringify(plant);

            // Direct SQL approach without transaction for debugging
            await db.executeSql(
                'INSERT OR REPLACE INTO favorites (plant_name, plant_data) VALUES (?, ?)',
                [plant.name, plantJson]
            );

            // Verify the plant was added
            const [results] = await db.executeSql(
                'SELECT * FROM favorites WHERE plant_name = ?',
                [plant.name]
            );

            const success = results.rows.length > 0;

            // Save database immediately after adding
            await this.saveDatabase();
            return success;
        } catch (error) {
            console.error(`Error directly adding plant ${plant.name}:`, error);
            console.log(`Error details: ${JSON.stringify(error)}`);
            return false;
        }
    }

    // Remove a plant from favorites
    static async removeFavorite(plantName) {
        const db = await this.initDB();

        try {
            await db.transaction(async (tx) => {
                await tx.executeSql(
                    'DELETE FROM favorites WHERE plant_name = ?',
                    [plantName]
                );
            });

            // Force a save after removing
            await this.saveDatabase();
            return true;
        } catch (error) {
            console.error('Error removing favorite:', error);
            return false;
        }
    }

    // Check if a plant is a favorite
    static async isFavorite(plantName) {
        const db = await this.initDB();

        try {
            const [results] = await db.executeSql(
                'SELECT * FROM favorites WHERE plant_name = ?',
                [plantName]
            );

            return results.rows.length > 0;
        } catch (error) {
            console.error('Error checking if plant is favorite:', error);
            return false;
        }
    }

    // Get all plant names in favorites
    static async getAllFavoriteNames() {
        const db = await this.initDB();
        try {
            const [results] = await db.executeSql('SELECT plant_name FROM favorites');
            const names = [];
            for (let i = 0; i < results.rows.length; i++) {
                names.push(results.rows.item(i).plant_name);
            }
            return names;
        } catch (error) {
            console.error('Error getting favorite names:', error);
            return [];
        }
    }

    // Ensure data is saved
    static async saveDatabase() {
        if (this.dbInstance) {
            try {
                // First ensure we have no active transactions
                // by committing any pending transactions
                try {
                    await this.dbInstance.executeSql('COMMIT');
                } catch (err) {
                    // Ignore errors from COMMIT as there may not be an active transaction
                }

                // Now we can safely run the PRAGMA commands
                await this.dbInstance.executeSql('PRAGMA synchronous = FULL');
                await this.dbInstance.executeSql('PRAGMA journal_mode = DELETE');

                // Force a checkpoint to ensure all changes are written to disk
                await this.dbInstance.executeSql('PRAGMA wal_checkpoint(FULL)');

                return true;
            } catch (error) {
                console.error('Error saving database:', error);
                return false;
            }
        }
        return false;
    }

    // Get database information for debugging
    static async getDatabaseInfo() {
        try {
            const db = await this.initDB();

            // Get database path
            const path = db.dbname || 'unknown';

            // Check if database file exists and its size
            let size = 'unknown';
            let tables = [];

            try {
                // Get database size (not directly available in React Native SQLite)
                const [pragmaResult] = await db.executeSql('PRAGMA page_count');
                const [pageSizeResult] = await db.executeSql('PRAGMA page_size');

                if (pragmaResult.rows.length > 0 && pageSizeResult.rows.length > 0) {
                    const pageCount = pragmaResult.rows.item(0).page_count;
                    const pageSize = pageSizeResult.rows.item(0).page_size;
                    size = (pageCount * pageSize) + ' bytes';
                }

                // Get list of tables
                const [tablesResult] = await db.executeSql("SELECT name FROM sqlite_master WHERE type='table'");
                for (let i = 0; i < tablesResult.rows.length; i++) {
                    tables.push(tablesResult.rows.item(i).name);
                }
            } catch (err) {
                console.error('Error getting detailed database info:', err);
            }

            // Get favorites count
            const [favoritesResult] = await db.executeSql('SELECT COUNT(*) as count FROM favorites');
            const favoritesCount = favoritesResult.rows.item(0).count;

            return {
                path,
                size,
                tables,
                favoritesCount
            };
        } catch (error) {
            console.error('Error getting database info:', error);
            return {
                path: 'error',
                size: 'error',
                tables: [],
                favoritesCount: 0
            };
        }
    }

    // Verify database persistence
    static async verifyDatabasePersistence() {
        try {
            const db = await this.initDB();
            const [results] = await db.executeSql('SELECT * FROM favorites');

            for (let i = 0; i < results.rows.length; i++) {
                const item = results.rows.item(i);
            }

            return results.rows.length > 0;
        } catch (error) {
            console.error('Error verifying database persistence:', error);
            return false;
        }
    }
    static async saveBooleanSetting(key, value) {
        const db = await this.initDB();

        try {
            await db.executeSql(
                'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
                [key, value ? '1' : '0']
            );

            await this.saveDatabase();
            return true;
        } catch (error) {
            console.error(`Error saving boolean setting ${key}:`, error);
            return false;
        }
    }

    // Load a boolean setting
    static async loadBooleanSetting(key, defaultValue = false) {
        const db = await this.initDB();

        try {
            const [result] = await db.executeSql(
                'SELECT value FROM app_settings WHERE key = ?',
                [key]
            );

            if (result.rows.length > 0) {
                return result.rows.item(0).value === '1';
            }
            return defaultValue;
        } catch (error) {
            console.error(`Error loading boolean setting ${key}:`, error);
            return defaultValue;
        }
    }
}