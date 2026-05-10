import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGES } from '../data/languages';
import { getLanguageInfo } from '../utils/api';
import { COLORS, SHADOWS } from '../components/theme';

export default function LanguagesScreen() {
  const [selected, setSelected] = useState(null);
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const african = LANGUAGES.filter(l => l.group === 'african');
  const international = LANGUAGES.filter(l => l.group === 'international');

  const handleSelect = async (lang) => {
    setSelected(lang);
    setInfo('');
    setLoading(true);
    try {
      const result = await getLanguageInfo(lang.name);
      setInfo(result);
    } catch (e) {
      setInfo('Could not load language info.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.sectionLabel}>🌍 African Languages</Text>
            {african.map(item => (
              <TouchableOpacity key={item.code} style={styles.card} onPress={() => handleSelect(item)}>
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={styles.cardText}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.region}>{item.region}</Text>
                </View>
                <View style={styles.speakerBadge}>
                  <Text style={styles.speakerText}>{item.speakers}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>🌐 International Languages</Text>
            {international.map(item => (
              <TouchableOpacity key={item.code} style={styles.card} onPress={() => handleSelect(item)}>
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={styles.cardText}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.region}>{item.region}</Text>
                </View>
                <View style={styles.speakerBadge}>
                  <Text style={styles.speakerText}>{item.speakers}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        renderItem={null}
        keyExtractor={() => 'header'}
        contentContainerStyle={styles.list}
      />

      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        <SafeAreaView style={styles.modal} edges={['top']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selected?.flag} {selected?.name}
            </Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.doneBtn}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{selected?.speakers}</Text>
                <Text style={styles.statLabel}>speakers</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{selected?.region}</Text>
                <Text style={styles.statLabel}>region</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>About this language</Text>
              {loading
                ? <ActivityIndicator color={COLORS.accent} style={{ marginTop: 12 }} />
                : <Text style={styles.infoText}>{info}</Text>
              }
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.white, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
    borderWidth: 0.5, borderColor: COLORS.border, ...SHADOWS.small,
  },
  flag: { fontSize: 26, width: 40 },
  cardText: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  region: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  speakerBadge: {
    backgroundColor: COLORS.accentLight, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  speakerText: { fontSize: 11, color: COLORS.accentText, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  doneBtn: { fontSize: 16, color: COLORS.accent, fontWeight: '500' },
  modalContent: { padding: 20 },
  statRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  stat: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 14,
    alignItems: 'center', borderWidth: 0.5, borderColor: COLORS.border,
  },
  statValue: { fontSize: 16, fontWeight: '700', color: COLORS.accent, marginBottom: 2 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  infoCard: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  infoTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  infoText: { fontSize: 15, color: COLORS.text, lineHeight: 24 },
});