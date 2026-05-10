import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory, deleteHistoryItem, clearHistory } from '../utils/storage';
import { COLORS, SHADOWS } from '../components/theme';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useFocusEffect(useCallback(() => { loadHistory(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Remove this translation from history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteHistoryItem(id);
        loadHistory();
      }},
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Clear History', 'Delete all saved translations?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: async () => {
        await clearHistory();
        setHistory([]);
      }},
    ]);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.langRow}>
        <Text style={styles.langPair}>
          {item.fromFlag} {item.fromLang}  →  {item.toFlag} {item.toLang}
        </Text>
        <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
      </View>
      <Text style={styles.inputText} numberOfLines={2}>{item.inputText}</Text>
      <View style={styles.divider} />
      <Text style={styles.translatedText} numberOfLines={2}>{item.translatedText}</Text>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {history.length > 0 && (
        <TouchableOpacity style={styles.clearAll} onPress={handleClearAll}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySubtitle}>Your translations will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, paddingBottom: 40 },
  clearAll: { alignSelf: 'flex-end', marginRight: 16, marginTop: 8 },
  clearAllText: { fontSize: 13, color: COLORS.danger },
  card: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: COLORS.border, ...SHADOWS.small,
  },
  langRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  langPair: { fontSize: 12, fontWeight: '600', color: COLORS.accent },
  date: { fontSize: 11, color: COLORS.textTertiary },
  inputText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  divider: { height: 0.5, backgroundColor: COLORS.border, marginVertical: 8 },
  translatedText: { fontSize: 15, color: COLORS.text, lineHeight: 22, fontWeight: '500' },
  deleteBtn: { position: 'absolute', top: 10, right: 10, padding: 6 },
  deleteText: { fontSize: 13, color: COLORS.textTertiary },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary },
});
