export const LANGUAGES = [
  // African Languages
  { code: 'sw', name: 'Swahili', region: 'East Africa', speakers: '200M', flag: '🇹🇿', group: 'african' },
  { code: 'zu', name: 'Zulu', region: 'South Africa', speakers: '12M', flag: '🇿🇦', group: 'african' },
  { code: 'xh', name: 'Xhosa', region: 'South Africa', speakers: '10M', flag: '🇿🇦', group: 'african' },
  { code: 'yo', name: 'Yoruba', region: 'West Africa', speakers: '50M', flag: '🇳🇬', group: 'african' },
  { code: 'ha', name: 'Hausa', region: 'West Africa', speakers: '70M', flag: '🇳🇬', group: 'african' },
  { code: 'ig', name: 'Igbo', region: 'Nigeria', speakers: '44M', flag: '🇳🇬', group: 'african' },
  { code: 'am', name: 'Amharic', region: 'Ethiopia', speakers: '57M', flag: '🇪🇹', group: 'african' },
  { code: 'sn', name: 'Shona', region: 'Zimbabwe', speakers: '15M', flag: '🇿🇼', group: 'african' },
  { code: 'st', name: 'Sesotho', region: 'Lesotho / South Africa', speakers: '8M', flag: '🇱🇸', group: 'african' },
  { code: 'tw', name: 'Twi', region: 'Ghana', speakers: '9M', flag: '🇬🇭', group: 'african' },
  { code: 'wo', name: 'Wolof', region: 'Senegal', speakers: '12M', flag: '🇸🇳', group: 'african' },
  { code: 'so', name: 'Somali', region: 'Somalia / Horn of Africa', speakers: '21M', flag: '🇸🇴', group: 'african' },
  { code: 'rw', name: 'Kinyarwanda', region: 'Rwanda', speakers: '12M', flag: '🇷🇼', group: 'african' },
  { code: 'ln', name: 'Lingala', region: 'Congo / DRC', speakers: '20M', flag: '🇨🇩', group: 'african' },
  { code: 'af', name: 'Afrikaans', region: 'South Africa', speakers: '7M', flag: '🇿🇦', group: 'african' },
  { code: 'nd', name: 'Ndebele', region: 'Zimbabwe / South Africa', speakers: '2M', flag: '🇿🇼', group: 'african' },
  { code: 'ny', name: 'Chichewa', region: 'Malawi / Zambia', speakers: '12M', flag: '🇲🇼', group: 'african' },

  // International
  { code: 'en', name: 'English', region: 'Global', speakers: '1.5B', flag: '🌍', group: 'international' },
  { code: 'fr', name: 'French', region: 'Global', speakers: '300M', flag: '🇫🇷', group: 'international' },
  { code: 'ar', name: 'Arabic', region: 'Middle East / Africa', speakers: '420M', flag: '🇸🇦', group: 'international' },
  { code: 'pt', name: 'Portuguese', region: 'Global', speakers: '250M', flag: '🇧🇷', group: 'international' },
  { code: 'es', name: 'Spanish', region: 'Global', speakers: '500M', flag: '🇪🇸', group: 'international' },
  { code: 'zh', name: 'Mandarin', region: 'China', speakers: '1.1B', flag: '🇨🇳', group: 'international' },
  { code: 'hi', name: 'Hindi', region: 'India', speakers: '600M', flag: '🇮🇳', group: 'international' },
];

export const getLanguageByCode = (code) => LANGUAGES.find(l => l.code === code);
export const getLanguageByName = (name) => LANGUAGES.find(l => l.name === name);
