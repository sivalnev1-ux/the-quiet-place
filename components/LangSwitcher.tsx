'use client';

import { useLang } from '@/lib/langContext';
import { Lang, SUPPORTED_LANGS } from '@/lib/i18n';

const LANG_LABELS: Record<Lang, string> = {
  he: 'עב',
  ru: 'Рус',
  en: 'EN',
};

export default function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`flex gap-1 ${className}`}>
      {SUPPORTED_LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            lang === l
              ? 'bg-[#C9A84C] text-white'
              : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
          }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
