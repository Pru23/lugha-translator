# 🌍 Lugha Translator

> **Lugha** means "language" in Swahili. This app is a mobile-first AI-powered translator focusing on African languages — helping bridge communication gaps across the continent and beyond.

---

## Why This App?

Most translation tools treat African languages as an afterthought. Lugha puts them front and center — with 15 African languages including Swahili, Yoruba, Zulu, Amharic, Hausa, and more. Built for real users, not just as a demo.

---

## Features

- 🔄 **AI Translation** — Powered by Claude (Anthropic) for high-quality, context-aware translations
- 🔍 **Auto Language Detection** — Paste any text and the app identifies the language automatically
- 🔤 **Pronunciation Guide** — Get phonetic guides and pronunciation tips for any translated text
- 🔊 **Text-to-Speech** — Listen to translations using native device TTS
- 📖 **Translation History** — All translations saved locally, swipeable and deletable
- 🌍 **Language Explorer** — Browse all 22 languages with speaker counts and AI-generated cultural info
- ↗ **Share Translations** — Share directly to any app

---

## Languages Supported

### African Languages (15)
| Language | Region | Speakers |
|----------|--------|----------|
| Swahili | East Africa | 200M |
| Hausa | West Africa | 70M |
| Yoruba | Nigeria/West Africa | 50M |
| Amharic | Ethiopia | 57M |
| Igbo | Nigeria | 44M |
| Somali | Horn of Africa | 21M |
| Lingala | Congo/DRC | 20M |
| Zulu | South Africa | 12M |
| Kinyarwanda | Rwanda | 12M |
| Xhosa | South Africa | 10M |
| Twi | Ghana | 9M |
| Sesotho | Lesotho/SA | 8M |
| Afrikaans | South Africa | 7M |
| Wolof | Senegal | 12M |
| Shona | Zimbabwe | 15M |

### International Languages (7)
English, French, Arabic, Portuguese, Spanish, Mandarin, Hindi

---

## Tech Stack

- **React Native** (Expo) — cross-platform iOS & Android
- **Claude API** (Anthropic) — translation, detection, pronunciation, language info
- **expo-speech** — text-to-speech
- **AsyncStorage** — local translation history
- **React Navigation** — bottom tab navigation

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS/Android)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/lugha-translator
cd lugha-translator
npm install
```

### Add your API key

Create a `.env` file in the root:
```
ANTHROPIC_API_KEY=your_key_here
```

Then in `src/utils/api.js`, update the fetch headers:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': process.env.ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
}
```

> **Note:** For production, never expose API keys in the client. Use a backend proxy server instead.

### Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## Project Structure

```
lugha-app/
├── App.js                    # Root with navigation
├── src/
│   ├── screens/
│   │   ├── TranslatorScreen.js  # Main translation UI
│   │   ├── HistoryScreen.js     # Saved translations
│   │   └── LanguagesScreen.js   # Language explorer
│   ├── components/
│   │   ├── LanguagePicker.js    # Modal language selector
│   │   └── theme.js             # Colors, typography
│   ├── utils/
│   │   ├── api.js               # Claude API calls
│   │   └── storage.js           # AsyncStorage helpers
│   └── data/
│       └── languages.js         # Language metadata
```

---

## Future Improvements

- [ ] Camera translation (point camera at text)
- [ ] Offline mode for common phrases
- [ ] Voice input (speech-to-text)
- [ ] Dark mode
- [ ] Favorite/starred translations
- [ ] Backend proxy for API key security

---

## About

Built by Prudence Dera as part of an AI portfolio project. This app was built using React Native + Expo and the Claude API by Anthropic.

---

## License
MIT
