import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './language/en.json';
import vi from './language/vi.json';
import {appStorage} from '../utils/storage';
import {KeyStoreData} from '../utils/constants';

const savedLanguage = appStorage.getString(KeyStoreData.LANGUAGE) || 'vi';

i18n.use(initReactI18next).init({
  resources: {
    en: {translation: en},
    vi: {translation: vi},
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
