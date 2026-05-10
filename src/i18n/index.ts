import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useSettingsStore } from '../stores/settingsStore';

import en from './translations/en.json';
import gu from './translations/gu.json';
import hi from './translations/hi.json';
import mr from './translations/mr.json';

const resources = {
  en: { translation: en },
  gu: { translation: gu },
  hi: { translation: hi },
  mr: { translation: mr },
};

const languageDetectorPlugin = {
  type: 'languageDetector',
  async: false,
  init: () => {},
  detect: function () {
    const lang = useSettingsStore.getState().defaultLanguage;
    return lang || 'gu';
  },
  cacheUserLanguage: function (language: string) {
    useSettingsStore.getState().setDefaultLanguage(language);
  },
};

i18n
  .use(languageDetectorPlugin as any)
  .use(initReactI18next)
  .init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: 'gu',
    interpolation: {
      escapeValue: false,
    },
  });

useSettingsStore.subscribe((state) => {
  if (state.defaultLanguage !== i18n.language) {
    i18n.changeLanguage(state.defaultLanguage);
  }
});

export default i18n;
