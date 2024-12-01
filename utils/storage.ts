import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@match_history');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load match history:", e);
    return [];
  }
};

export const saveHistory = async (history) => {
  try {
    const jsonValue = JSON.stringify(history);
    await AsyncStorage.setItem('@match_history', jsonValue);
  } catch (e) {
    console.error("Failed to save match history:", e);
  }
};