import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * Retrieves the stored object value.
 * 
 * Returns the JSON string if the promise resolves to a stored value or null otherwise.
 * @param itemKey 
 * @returns Promise<string | null>
 */
const getData = async (itemKey: string) => {
    const jsonValue = await AsyncStorage.getItem(itemKey)
    return jsonValue
}

/**
 * Adds new data (when no data for key exists), or modifies existing data (if previous data for key exists).
 * @param itemKey 
 * @param item 
 */
const setData = async (itemKey: string, item: any) => {
    const jsonValue = JSON.stringify(item)
    await AsyncStorage.setItem(itemKey, jsonValue)
}

/**
 * Removes item for a key.
 * @param itemKey 
 */
const removeData = async (itemKey: string) => {
    await AsyncStorage.removeItem(itemKey)
}

const StorageService = {
    getData,
    setData,
    removeData
}

export default StorageService