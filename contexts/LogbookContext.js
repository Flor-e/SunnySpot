// contexts/LogbookContext.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import { AppState } from 'react-native';
import DatabaseService from '../utils/database';

const LogbookContext = createContext();

export function LogbookProvider({ children }) {
    const [logbooks, setLogbooks] = useState([]);
    const [selectedLogbook, setSelectedLogbook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sync with SQLite
    const syncWithSQLite = async (logsToSync) => {
        try {
            if (!Array.isArray(logsToSync)) {
                console.warn('Logbooks is not an array:', logsToSync);
                return;
            }

            // Save each logbook
            for (const logbook of logsToSync) {
                if (!logbook || !logbook.id) continue;
                await DatabaseService.saveLogbook(logbook);
            }

            // Get all logbook IDs from the database
            const db = await DatabaseService.initDB();
            const [results] = await db.executeSql('SELECT id FROM logbooks');
            const dbIds = [];
            for (let i = 0; i < results.rows.length; i++) {
                dbIds.push(results.rows.item(i).id);
            }

            // Find logbooks to remove - logbooks in DB but not in memory
            const memoryIds = logsToSync.map(l => l.id);
            const logbooksToRemove = dbIds.filter(id => !memoryIds.includes(id));

            // Remove logbooks not in the list
            for (const logbookId of logbooksToRemove) {
                await DatabaseService.deleteLogbook(logbookId);
            }

            // Save database to ensure changes are persisted
            await DatabaseService.saveDatabase();
        } catch (error) {
            console.error('Error in logbooks sync:', error);
        }
    };

    useEffect(() => {
        const initializeLogbooks = async () => {
            setIsLoading(true);
            try {
                // Initialize the database
                await DatabaseService.initDB();

                // Get logbooks from SQLite
                const sqliteLogbooks = await DatabaseService.getLogbooks();
                setLogbooks(sqliteLogbooks);

                // If there are logbooks, select the first one (most recently created)
                if (sqliteLogbooks.length > 0) {
                    const mostRecentLogbook = sqliteLogbooks[0];

                    // Save the most recent logbook's ID as the last selected
                    await DatabaseService.saveLastSelectedLogbookId(mostRecentLogbook.id);

                    // Set the selected logbook
                    setSelectedLogbook(mostRecentLogbook);
                }
            } catch (error) {
                console.error('Error initializing logbooks:', error);
                setLogbooks([]);
            } finally {
                setIsLoading(false);
            }
        };

        initializeLogbooks();

        return () => {
            // Clean up when component unmounts
        };
    }, []);

    // AppState listener for background/foreground transitions
    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                try {
                    await syncWithSQLite(logbooks);
                    await DatabaseService.saveDatabase();
                } catch (error) {
                    console.error('Error saving logbooks before background:', error);
                }
            } else if (nextAppState === 'active') {
                try {
                    const sqliteLogbooks = await DatabaseService.getLogbooks();

                    // Only update state if there's a difference
                    if (JSON.stringify(sqliteLogbooks) !== JSON.stringify(logbooks)) {
                        setLogbooks(sqliteLogbooks);

                        // Update selected logbook if needed
                        if (selectedLogbook) {
                            const updatedSelectedLogbook = sqliteLogbooks.find(lb => lb.id === selectedLogbook.id);
                            if (updatedSelectedLogbook) {
                                setSelectedLogbook(updatedSelectedLogbook);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error loading logbooks after returning to foreground:', error);
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [logbooks, selectedLogbook]);

    // Save selected logbook ID when it changes
    useEffect(() => {
        const initializeLogbooks = async () => {
            setIsLoading(true);
            try {
                // Initialize the database
                await DatabaseService.initDB();

                // Get logbooks from SQLite
                const sqliteLogbooks = await DatabaseService.getLogbooks();
                setLogbooks(sqliteLogbooks);

                // Get last selected logbook ID
                const lastSelectedLogbookId = await DatabaseService.getLastSelectedLogbookId();

                if (lastSelectedLogbookId) {
                    const lastLogbook = sqliteLogbooks.find(lb => lb.id === lastSelectedLogbookId);
                    console.log('Found matching logbook?', !!lastLogbook,
                        lastLogbook ? `Title: ${lastLogbook.title}` : 'No matching logbook');

                    if (lastLogbook) {
                        console.log('Setting selected logbook to:', lastLogbook.title);
                        setSelectedLogbook(lastLogbook);
                    } else {
                        console.log('No matching logbook found for ID:', lastSelectedLogbookId);
                        // Clear the last selected logbook ID since it's no longer valid
                        await DatabaseService.saveLastSelectedLogbookId(null);
                    }
                }
            } catch (error) {
                console.error('Error initializing logbooks:', error);
                console.error('Detailed error:', JSON.stringify(error));
                setLogbooks([]);
            } finally {
                setIsLoading(false);
            }
        };

        initializeLogbooks();

        return () => {
            // Clean up when component unmounts
        };
    }, []);

    // Create a new logbook with a unique ID
    const createLogbook = async (title) => {
        const formattedTitle = title.trim() || `Logbook ${logbooks.length + 1}`;

        // Generate a unique ID by appending a timestamp
        const uniqueId = `${formattedTitle}_${Date.now()}`;

        const newLogbook = {
            id: uniqueId,  // Use the unique ID
            title: formattedTitle,  // Keep the original title
            measurements: [],
            average: 0,
            plantProfile: { size: '', looks: '', loveLevel: '', watering: '', pets: '' }
        };

        try {
            const success = await DatabaseService.saveLogbook(newLogbook);

            if (success) {
                setLogbooks(prev => [...prev, newLogbook]);
                setSelectedLogbook(newLogbook);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error creating logbook in context:', error);
            return false;
        }
    };

    // Delete a logbook
    const deleteLogbook = async (logbookId) => {

        // Add this validation to ensure we have a string
        if (typeof logbookId !== 'string') {
            console.error('Invalid logbook ID type:', typeof logbookId);
            if (logbookId && logbookId.id) {
                // If an object with an id was passed, use that instead
                logbookId = logbookId.id;
            } else {
                console.error('Failed to delete logbook: Invalid ID');
                return false;
            }
        }

        try {
            const success = await DatabaseService.deleteLogbook(logbookId);


            if (success) {
                // Remove the logbook from state
                const updatedLogbooks = logbooks.filter(lb => lb.id !== logbookId);

                setLogbooks(updatedLogbooks);

                // Clear selected logbook if it was the deleted one
                if (selectedLogbook && selectedLogbook.id === logbookId) {
                    setSelectedLogbook(null);
                }

                return true;
            } else {
                console.error('Failed to delete logbook:', logbookId);
                return false;
            }
        } catch (error) {
            console.error('Error deleting logbook:', {
                logbookId,
                error: error.message,
                stack: error.stack
            });
            return false;
        }
    };

    // Add a measurement to a logbook
    const addMeasurement = async (logbookId, measurement) => {
        try {
            const success = await DatabaseService.addMeasurement(logbookId, measurement);
            if (success) {
                // Update logbooks state
                setLogbooks(prev => {
                    return prev.map(lb => {
                        if (lb.id === logbookId) {
                            const measurements = [...lb.measurements, measurement];
                            const average = measurements.reduce((sum, m) => sum + m.lux, 0) / measurements.length;
                            return {
                                ...lb,
                                measurements,
                                average: Math.round(average)
                            };
                        }
                        return lb;
                    });
                });

                // Update selected logbook if needed
                if (selectedLogbook && selectedLogbook.id === logbookId) {
                    setSelectedLogbook(prev => {
                        const measurements = [...prev.measurements, measurement];
                        const average = measurements.reduce((sum, m) => sum + m.lux, 0) / measurements.length;
                        return {
                            ...prev,
                            measurements,
                            average: Math.round(average)
                        };
                    });
                }

                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding measurement:', error);
            return false;
        }
    };

    // Delete a measurement from a logbook
    const deleteMeasurement = async (logbookId, timestamp) => {

        // Validate inputs
        if (!logbookId) {
            console.error('Invalid logbookId: Cannot delete measurement', { logbookId });
            return false;
        }

        if (!timestamp) {
            console.error('Invalid timestamp: Cannot delete measurement', { timestamp });
            return false;
        }

        try {
            const success = await DatabaseService.deleteMeasurement(logbookId, timestamp);

            if (success) {
                // Update logbooks state
                setLogbooks(prev => {
                    const updatedLogbooks = prev.map(lb => {
                        if (lb.id === logbookId) {
                            const measurements = lb.measurements.filter(m => m.timestamp !== timestamp);
                            const average = measurements.length > 0
                                ? Math.round(measurements.reduce((sum, m) => sum + m.lux, 0) / measurements.length)
                                : 0;

                            return {
                                ...lb,
                                measurements,
                                average
                            };
                        }
                        return lb;
                    });

                    return updatedLogbooks;
                });

                // Update selected logbook if needed
                if (selectedLogbook && selectedLogbook.id === logbookId) {

                    setSelectedLogbook(prev => {
                        const measurements = prev.measurements.filter(m => m.timestamp !== timestamp);
                        const average = measurements.length > 0
                            ? Math.round(measurements.reduce((sum, m) => sum + m.lux, 0) / measurements.length)
                            : 0;

                        return {
                            ...prev,
                            measurements,
                            average
                        };
                    });
                }

                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting measurement in context:', {
                error: error.message,
                stack: error.stack,
                logbookId,
                timestamp
            });
            return false;
        }
    };

    // Update logbook preferences
    const updateLogbookPreferences = async (logbookId, plantProfile) => {
        try {
            // Find the logbook to update
            const logbookToUpdate = logbooks.find(lb => lb.id === logbookId);
            if (!logbookToUpdate) {
                console.error(`Logbook ${logbookId} not found`);
                return false;
            }

            // Update the logbook with new preferences
            const updatedLogbook = {
                ...logbookToUpdate,
                plantProfile,
                // Explicitly pass FULL existing measurements
                measurements: logbookToUpdate.measurements.map(m => ({
                    ...m,
                    displayTimestamp: m.display_timestamp || m.displayTimestamp || '' // Ensure display_timestamp exists
                }))
            };

            const success = await DatabaseService.saveLogbook(updatedLogbook);

            if (success) {
                // Update logbooks state
                setLogbooks(prev => prev.map(lb =>
                    lb.id === logbookId
                        ? { ...lb, plantProfile }
                        : lb
                ));

                // Update selected logbook if needed
                if (selectedLogbook && selectedLogbook.id === logbookId) {
                    setSelectedLogbook(prev => ({
                        ...prev,
                        plantProfile
                    }));
                }

                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating logbook preferences:', error);
            return false;
        }
    };

    return (
        <LogbookContext.Provider value={{
            logbooks,
            selectedLogbook,
            setSelectedLogbook,
            createLogbook,
            deleteLogbook,
            addMeasurement,
            deleteMeasurement,
            updateLogbookPreferences,
            isLoading
        }}>
            {children}
        </LogbookContext.Provider>
    );
}

export function useLogbooks() {
    const context = useContext(LogbookContext);
    if (!context) {
        throw new Error('useLogbooks must be used within a LogbookProvider');
    }
    return context;
}