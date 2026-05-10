import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'lugha_history';
const MAX_HISTORY = 50;

export const saveTranslation = async (item) => {
  try {
    const existing = await getHistory();
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...item,
    };
    const updated = [newItem, ...existing].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newItem;
  } catch (e) {
    console.error('Save error:', e);
  }
};

export const getHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const deleteHistoryItem = async (id) => {
  try {
    const existing = await getHistory();
    const updated = existing.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Delete error:', e);
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Clear error:', e);
  }
};
