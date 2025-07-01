import SidePanel from './SidePanel';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import useExternalLink from '../hooks/useExternalLink';
import { GITHUB_REPOSITORY_URL } from '../utils/constants';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { t } = useTranslation();
  const openExternalLink = useExternalLink();
  const [appVersion, setAppVersion] = useState('N/A');
  const [licenses, setLicenses] = useState('');

  useEffect(() => {
    if (isOpen && window.backend && window.backend.getAppVersion) {
      window.backend.getAppVersion().then(version => {
        if (typeof version === 'string') {
          setAppVersion(version);
        } else if (version && 'error' in version) {
          console.error('Failed to get app version:', version.error);
        }
      }).catch(error => {
        console.error('Error calling getAppVersion:', error);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    fetch('./licenses.txt')
      .then(res => res.text())
      .then(setLicenses);
  }, []);

  return (
    <SidePanel open={isOpen} onClose={onClose}>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        {t('common.Settings')}
      </h3>
      <ul className="mt-2">
        <li className="mb-4 flex gap-2 items-center">
          <p className="text-sm text-gray-500 w-24">{t('common.LanguageSetting') }</p>
          <LanguageSwitcher />
        </li>
        <li className="mb-4 flex gap-2 items-center">
          <p className="text-sm text-gray-500 w-24">{t('common.Version')}</p>
          <p>{appVersion}</p>
        </li>
        <li className="mb-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => openExternalLink(GITHUB_REPOSITORY_URL)}
          >
            {t('common.GitHubRepository')}
          </button>
        </li>
        <li className="mt-8 border-t pt-4 text-xs text-gray-500">
          <p className="text-sm text-gray-500 mb-3">利用OSS・ライセンス一覧</p>
          <div className="whitespace-pre-line flex-1 min-h-[100px] overflow-y-scroll break-words" style={{maxHeight: 'calc(100vh - 300px)'}}>
            <pre className='whitespace-pre-line break-words'>{licenses}</pre>
          </div>
        </li>
      </ul>
    </SidePanel>
  );
};

export default SettingsPanel;
