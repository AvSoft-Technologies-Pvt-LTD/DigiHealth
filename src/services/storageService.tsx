import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageValue = string | number | boolean | object | null;

const StorageService = {
  /**
   * Get a value from storage
   * @param key - The key to get
   * @returns The stored value or null if not found
   */
  async get<T = string>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting value for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Save a value to storage
   * @param key - The key under which to store the value
   * @param value - The value to store (will be stringified if not a string)
   */
  async save(key: string, value: StorageValue): Promise<void> {
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error saving value for key "${key}":`, error);
      throw error;
    }
  },

  /**
   * Remove a value from storage
   * @param key - The key to remove
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key "${key}":`, error);
      throw error;
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  /**
   * Get all keys in storage
   * @returns Array of all storage keys
   */
  async keys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  },

  /**
   * Push a value to an array in storage
   * @param key - The key of the array
   * @param value - The value to push to the array
   */
  async push<T>(key: string, value: T): Promise<void> {
    try {
      const currentValue = await this.get<T[]>(key);
      const newArray = Array.isArray(currentValue) ? currentValue : [];
      await this.save(key, [...newArray, value]);
    } catch (error) {
      console.error(`Error pushing to array for key "${key}":`, error);
      throw error;
    }
  }
};

export default StorageService;