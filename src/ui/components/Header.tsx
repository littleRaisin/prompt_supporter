import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import SearchCategoryCheckbox from './SearchCategoryCheckbox';
import useExternalLink from '../hooks/useExternalLink'; // useExternalLinkをインポート
import SettingsPanel from './SettingsPanel';

type FormData = {
  search: string;
};

type SearchCategories = {
  character: boolean;
  tag: boolean;
  copyright: boolean;
};

const SEARCH_CATEGORIES_KEY = 'search_categories';

const Header = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const { promptName } = useParams<{ promptName: string }>();
  const openExternalLink = useExternalLink();
  const { t } = useTranslation();

  const [searchCategories, setSearchCategories] = useState<SearchCategories>(() => {
    const saved = localStorage.getItem(SEARCH_CATEGORIES_KEY);
    return saved ? JSON.parse(saved) : { character: true, tag: true, copyright: true };
  });

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SEARCH_CATEGORIES_KEY, JSON.stringify(searchCategories));
  }, [searchCategories]);

  const handleCategoryChange = (category: keyof SearchCategories) => {
    setSearchCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const onSubmit = (data: FormData) => {
    const params = new URLSearchParams();
    if (searchCategories.character) params.append('character', 'true');
    if (searchCategories.tag) params.append('tag', 'true');
    if (searchCategories.copyright) params.append('copyright', 'true');

    const queryString = params.toString();
    navigate(`/search/${data.search}${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <header className="bg-gray-800 text-white p-4 relative w-full">
      <h1 className="text-2xl font-bold">
        <Link to="/" className="text-white">Prompt Supporter</Link>
      </h1>
      <button
        className="absolute top-4 right-4 h-[2rem]"
        onClick={() => setSettingsOpen(true)}
        aria-label={t('common.Settings')}
      >
        <img src="./ico_settings.svg" alt={t('common.Settings')} className="w-6 h-6" />
      </button>
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div className="flex justify-between items-center">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex gap-2 flex-wrap">
            <div className="flex gap-2 mr-4">
              <input
                {...register('search')}
                type="text"
                className="text-black px-2"
                placeholder={t('common.SearchWord')}
                defaultValue={promptName ? promptName : ''}
              />
              <Button 
                type="submit"
                text={t('common.Search')}
              />
            </div>
            <div className="flex items-center gap-2 mr-4">
              <SearchCategoryCheckbox
                label={t('common.Character')}
                categoryKey="character"
                checked={searchCategories.character}
                onChange={handleCategoryChange}
              />
              <SearchCategoryCheckbox
                label={t('common.Tag')}
                categoryKey="tag"
                checked={searchCategories.tag}
                onChange={handleCategoryChange}
              />
              <SearchCategoryCheckbox
                label={t('common.Copyrights')}
                categoryKey="copyright"
                checked={searchCategories.copyright}
                onChange={handleCategoryChange}
              />
            </div>
          </form>
          <nav>
            <ul className='flex gap-4 mt-2'>
              {
                [
                  { link: '/favorite/character', label: t('common.Character') },
                  { link: '/favorite/tag', label: t('common.Tag') },
                  { link: '/favorite/copyright', label: t('common.Copyrights') },
                  { link: '/create', label: t('common.New Registration') },
                ].map((item) => (
                  <li key={item.link}>
                    <Link to={item.link} className="text-white hover:text-gray-300">
                      {item.label}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
