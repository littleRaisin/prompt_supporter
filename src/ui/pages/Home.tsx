import { useEffect, useState } from 'react';
import Result from '../components/Result';
import DetailPanel from '../components/DetailPanel';

type Translation = {
  danbooru_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
  updated_at?: string;
};

const Home = () => {
  const [favorites, setFavorites] = useState<Translation[]>([]);
  const [currentItem, setCurrentItem] = useState<Translation | null>(null);

  useEffect(() => {
    window.backend.getFavoriteList().then((res) => {
      if (Array.isArray(res)) {
        setFavorites(res);
      }
    });
  }, []);

  const handleClick = (item?: Translation) => () => {
    if (item) setCurrentItem(item);
  };
  const handleEdit = (item?: Translation) => () => {
    if (item) window.location.hash = `/edit/${item.danbooru_name}`;
  };

  return (
    <div className='App relative'>
      <h2 className="text-xl font-bold mb-4">お気に入り一覧</h2>
      {favorites.length === 0 ? (
        <div>お気に入りはありません。</div>
      ) : (
        <div className='flex justify-between w-full max-w-full'>
          <div>
            <ul>
              {favorites.map(item => (
                <li key={item.danbooru_name} className="mb-2">
                  <Result
                    item={item}
                    handleClick={handleClick}
                    handleEdit={handleEdit}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className='w-60'>
            <div className='sticky top-0 border-[1px] rounded border-gray p-4 bg-white'>
              <DetailPanel item={currentItem} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;