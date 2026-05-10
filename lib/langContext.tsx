'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  Lang,
  Translations,
  translations,
  detectLang,
  saveLang,
  isRTL,
} from './i18n';

interface LangContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
  dir: 'rtl' | 'ltr';
}

const LangContext = createContext<LangContextValue>({
  lang: 'he',
  t: translations.he,
  setLang: () => {},
  dir: 'rtl',
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('he');

  useEffect(() => {
    const detected = detectLang();
    setLangState(detected);
  }, []);

  // Apply dir & lang attributes to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isRTL(lang) ? 'rtl' : 'ltr');
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    saveLang(l);
  }, []);

  const value: LangContextValue = {
    lang,
    t: translations[lang],
    setLang,
    dir: isRTL(lang) ? 'rtl' : 'ltr',
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
