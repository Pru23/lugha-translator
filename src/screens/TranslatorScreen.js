import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert, Animated,
  KeyboardAvoidingView, Platform, Share,
} from 'react-native';
import * as Speech from 'expo-speech';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../components/theme';
import LanguagePicker from '../components/LanguagePicker';
import { detectLanguage, translateText, getPronunciation } from '../utils/api';
import { saveTranslation } from '../utils/storage';
import { LANGUAGES } from '../data/languages';

const QUICK_PHRASES = [
  'Hello, how are you?',
  'Thank you very much',
  'Where is the hospital?',
  'I love you',
  'What is your name?',
  'Good morning',
  'Please help me',
];

export default function TranslatorScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [fromLang, setFromLang] = useState(LANGUAGES.find(l => l.code === 'en'));
  const [toLang, setToLang] = useState(LANGUAGES.find(l => l.code === 'sw'));
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoadingPronunciation, setIsLoadingPronunciation] = useState(false);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const handleDetect = async () => {
    if (!inputText.trim()) return;
    setIsDetecting(true);
    try {
      const detected = await detectLanguage(inputText);
      const match = LANGUAGES.find(l => l.name.toLowerCase() === detected.toLowerCase());
      if (match) setFromLang(match);
      else Alert.alert('Detection', `Detected: ${detected}`);
    } catch (e) {
      Alert.alert('Error', 'Could not detect language.');
    }
    setIsDetecting(false);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    if (fromLang.code === toLang.code) {
      Alert.alert('Same language', 'Please select two different languages.');
      return;
    }
    setIsTranslating(true);
    setTranslatedText('');
    setPronunciation('');
    setShowPronunciation(false);
    try {
      const result = await translateText(inputText, fromLang.name, toLang.name);
      setTranslatedText(result);
      fadeIn();
      await saveTranslation({
        inputText,
        translatedText: result,
        fromLang: fromLang.name,
        toLang: toLang.name,
        fromFlag: fromLang.flag,
        toFlag: toLang.flag,
      });
    } catch (e) {
      Alert.alert('Error', 'Translation failed. Please check your connection.');
    }
    setIsTranslating(false);
  };

  const handlePronunciation = async () => {
    if (!translatedText) return;
    if (showPronunciation && pronunciation) {
      setShowPronunciation(!showPronunciation);
      return;
    }
    setIsLoadingPronunciation(true);
    try {
      const result = await getPronunciation(translatedText, toLang.name);
      setPronunciation(result);
      setShowPronunciation(true);
    } catch (e) {
      Alert.alert('Error', 'Could not get pronunciation guide.');
    }
    setIsLoadingPronunciation(false);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    if (!translatedText) return;
    setIsSpeaking(true);
    Speech.speak(translatedText, {
      language: toLang.code,
      onDone: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert('TTS unavailable', `Text-to-speech may not be available for ${toLang.name} on this device.`);
      },
    });
  };

  const handleSwap = () => {
    const prevFrom = fromLang;
    const prevTo = toLang;
    setFromLang(prevTo);
    setToLang(prevFrom);
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText('');
      setPronunciation('');
      setShowPronunciation(false);
    }
  };

  const handleShare = async () => {
    if (!translatedText) return;
    await Share.share({
      message: `${fromLang.flag} ${inputText}\n${toLang.flag} ${translatedText}\n\nTranslated with Lugha`,
    });
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setPronunciation('');
    setShowPronunciation(false);
  };

  const renderPronunciation = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.replace(/\*\*(.*?)\*\*/g, '§$1§').split('§');
      return (
        <Text key={i} style={[styles.pronText, { marginBottom: 4 }]}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <Text key={j} style={styles.pronBold}>{part}</Text>
              : part
          )}
        </Text>
      );
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Language Selector Bar */}
        <View style={styles.langBar}>
          <TouchableOpacity style={styles.langBtn} onPress={() => setPickerOpen('from')}>
            <Text style={styles.langFlag}>{fromLang.flag}</Text>
            <Text style={styles.langName}>{fromLang.name}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.langBtn} onPress={() => setPickerOpen('to')}>
            <Text style={styles.langFlag}>{toLang.flag}</Text>
            <Text style={styles.langName}>{toLang.name}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Phrases */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.phrasesScroll}>
          {QUICK_PHRASES.map(phrase => (
            <TouchableOpacity
              key={phrase}
              style={styles.phraseChip}
              onPress={() => setInputText(phrase)}
            >
              <Text style={styles.phraseText}>{phrase}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Card */}
        <View style={[styles.card, styles.inputCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.langBadge}>
              <Text style={styles.langBadgeText}>{fromLang.flag} {fromLang.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.detectBtn}
              onPress={handleDetect}
              disabled={!inputText.trim() || isDetecting}
            >
              {isDetecting
                ? <ActivityIndicator size="small" color={COLORS.accent} />
                : <Text style={styles.detectText}>Auto-detect</Text>
              }
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Type or paste text here..."
            placeholderTextColor={COLORS.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            textAlignVertical="top"
          />

          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>{inputText.length} chars</Text>
            {inputText.length > 0 && (
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Translate Button */}
        <TouchableOpacity
          style={[styles.translateBtn, (!inputText.trim() || isTranslating) && styles.translateBtnDisabled]}
          onPress={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
        >
          {isTranslating
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.translateBtnText}>Translate</Text>
          }
        </TouchableOpacity>

        {/* Output Card */}
        {(translatedText || isTranslating) && (
          <Animated.View style={[styles.card, styles.outputCard, { opacity: fadeAnim }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.langBadge, styles.langBadgeAccent]}>
                <Text style={styles.langBadgeTextAccent}>{toLang.flag} {toLang.name}</Text>
              </View>
              {translatedText && (
                <View style={styles.outputActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                    <Text style={styles.actionIcon}>↗</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleSpeak}>
                    <Text style={styles.actionIcon}>{isSpeaking ? '⏹' : '▶'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {isTranslating && !translatedText
              ? <ActivityIndicator style={{ padding: 20 }} color={COLORS.accent} />
              : <Text style={styles.outputText} selectable>{translatedText}</Text>
            }

            {/* Pronunciation Section */}
            {translatedText && (
              <TouchableOpacity
                style={styles.pronBtn}
                onPress={handlePronunciation}
                disabled={isLoadingPronunciation}
              >
                {isLoadingPronunciation
                  ? <ActivityIndicator size="small" color={COLORS.accent} />
                  : <Text style={styles.pronBtnText}>
                      {showPronunciation ? '▲ Hide pronunciation' : '🔤 Show pronunciation guide'}
                    </Text>
                }
              </TouchableOpacity>
            )}

            {showPronunciation && pronunciation && (
              <View style={styles.pronCard}>
                {renderPronunciation(pronunciation)}
              </View>
            )}
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <LanguagePicker
        visible={pickerOpen === 'from'}
        title="Translate from"
        onSelect={setFromLang}
        onClose={() => setPickerOpen(null)}
      />
      <LanguagePicker
        visible={pickerOpen === 'to'}
        title="Translate to"
        onSelect={setToLang}
        onClose={() => setPickerOpen(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  langBar: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 14,
    backgroundColor: COLORS.white, borderRadius: 14, padding: 6,
    borderWidth: 0.5, borderColor: COLORS.border, ...SHADOWS.small,
  },
  langBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 6,
  },
  langFlag: { fontSize: 20, marginRight: 6 },
  langName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text },
  chevron: { fontSize: 18, color: COLORS.textTertiary },
  swapBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 4,
  },
  swapIcon: { fontSize: 16, color: COLORS.accent },
  phrasesScroll: { marginBottom: 14 },
  phraseChip: {
    backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 7, marginRight: 8, borderWidth: 0.5, borderColor: COLORS.border,
  },
  phraseText: { fontSize: 13, color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 12,
    borderWidth: 0.5, borderColor: COLORS.border, ...SHADOWS.small, overflow: 'hidden',
  },
  inputCard: {},
  outputCard: { borderColor: COLORS.accent + '33' },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  langBadge: {
    backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  langBadgeText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  langBadgeAccent: { backgroundColor: COLORS.accentLight },
  langBadgeTextAccent: { fontSize: 13, color: COLORS.accentText, fontWeight: '500' },
  detectBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  detectText: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },
  input: {
    fontSize: 16, color: COLORS.text, padding: 14, minHeight: 110, lineHeight: 24,
  },
  inputFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingBottom: 10,
  },
  charCount: { fontSize: 12, color: COLORS.textTertiary },
  clearText: { fontSize: 12, color: COLORS.danger },
  translateBtn: {
    backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', marginBottom: 12, ...SHADOWS.small,
  },
  translateBtnDisabled: { backgroundColor: COLORS.textTertiary },
  translateBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white, letterSpacing: 0.3 },
  outputText: { fontSize: 17, color: COLORS.text, padding: 14, lineHeight: 26 },
  outputActions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  actionIcon: { fontSize: 14, color: COLORS.accent },
  pronBtn: {
    borderTopWidth: 0.5, borderTopColor: COLORS.border,
    paddingVertical: 10, paddingHorizontal: 14,
  },
  pronBtnText: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },
  pronCard: {
    backgroundColor: COLORS.accentLight, margin: 10, borderRadius: 10, padding: 12,
  },
  pronText: { fontSize: 13, color: COLORS.accentText, lineHeight: 20 },
  pronBold: { fontWeight: '700', color: COLORS.accentText },
});