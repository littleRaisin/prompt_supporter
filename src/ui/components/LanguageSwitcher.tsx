import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGE_KEY = 'app_language';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return saved ? saved : 'ja';
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
<select
      value={language}
      onChange={e => setLanguage(e.target.value)}
      className="text-black px-2 py-1 rounded"
      style={{ minWidth: 80 }}
    >
      <option value="en">{t('English')}</option>
      <option value="ja">{t('Japanese')}</option>
    </select>
  );
};

export default LanguageSwitcher;
