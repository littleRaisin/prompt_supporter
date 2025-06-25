import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Button from './Button';
import SearchCategoryCheckbox from './SearchCategoryCheckbox';
import useExternalLink from '../hooks/useExternalLink'; // useExternalLinkをインポート
import TextButton from './TextButton';

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
  const openExternalLink = useExternalLink(); // useExternalLinkフックを使用

  const [searchCategories, setSearchCategories] = useState<SearchCategories>(() => {
    const saved = localStorage.getItem(SEARCH_CATEGORIES_KEY);
    return saved ? JSON.parse(saved) : { character: true, tag: true, copyright: true };
  });

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
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold">
        <Link to="/" className="text-white">Prompt Supporter</Link>
      </h1>
      <div className="flex justify-between items-center">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex gap-2">
            <input
              {...register('search')}
              type="text"
              className="text-black px-2"
              placeholder="検索ワード"
              defaultValue={promptName ? promptName : ''}
            />
            <Button 
              type="submit"
              text="検索"
            />
            <div className="flex items-center gap-2 ml-4">
              <SearchCategoryCheckbox
                label="キャラ"
                categoryKey="character"
                checked={searchCategories.character}
                onChange={handleCategoryChange}
              />
              <SearchCategoryCheckbox
                label="タグ"
                categoryKey="tag"
                checked={searchCategories.tag}
                onChange={handleCategoryChange}
              />
              <SearchCategoryCheckbox
                label="コピーライト"
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
                  { link: '/favorite/character', label: 'キャラ' },
                  { link: '/favorite/tag', label: 'タグ' },
                  { link: '/favorite/copyright', label: 'コピーライト' },
                  { link: '/create', label: '新規登録' },
                ].map((item) => (
                  <li key={item.link}>
                    <Link to={item.link} className="text-white hover:text-gray-300">
                      {item.label}
                    </Link>
                  </li>
                ))
              }
              <li>
                <TextButton
                  onClick={() => openExternalLink("https://github.com/littleRaisin/prompt_supporter")}
                >
                  GitHub
                </TextButton>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
