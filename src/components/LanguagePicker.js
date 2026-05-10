import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, FlatList,
  TextInput, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGES } from '../data/languages';
import { COLORS, TYPOGRAPHY } from './theme';

export default function LanguagePicker({ visible, onSelect, onClose, title }) {
  const [search, setSearch] = useState('');

  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.region.toLowerCase().includes(search.toLowerCase())
  );

  const african = filtered.filter(l => l.group === 'african');
  const international = filtered.filter(l => l.group === 'international');

  const renderSection = (label, data) => (
    data.length > 0 ? (
      <>
        <Text style={styles.sectionLabel}>{label}</Text>
        {data.map(item => (
          <TouchableOpacity key={item.code} style={styles.item} onPress={() => { onSelect(item); onClose(); setSearch(''); }}>
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.itemText}>
              <Text style={styles.langName}>{item.name}</Text>
              <Text style={styles.langRegion}>{item.region} · {item.speakers} speakers</Text>
            </View>
          </TouchableOpacity>
        ))}
      </>
    ) : null
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>{title || 'Select Language'}</Text>
          <TouchableOpacity onPress={() => { onClose(); setSearch(''); }} style={styles.closeBtn}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.search}
            placeholder="Search languages..."
            placeholderTextColor={COLORS.textTertiary}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>
        <FlatList
          data={[]}
          ListHeaderComponent={() => (
            <View>
              {renderSection('🌍 African Languages', african)}
              {renderSection('🌐 International', international)}
            </View>
          )}
          renderItem={null}
          keyExtractor={() => 'header'}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 17, fontWeight: '600', color: COLORS.text },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 16, color: COLORS.accent, fontWeight: '500' },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 10 },
  search: {
    backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 15, color: COLORS.text, borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 12, fontWeight: '600', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 20, marginBottom: 6,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  flag: { fontSize: 26, width: 40 },
  itemText: { flex: 1 },
  langName: { fontSize: 16, color: COLORS.text, fontWeight: '500' },
  langRegion: { fontSize: 13, color: COLORS.textSecondary, marginTop: 1 },
});