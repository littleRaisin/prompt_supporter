import { useEffect, useState } from 'react';
import Result from '../components/Result';
import DetailPanel from '../components/DetailPanel';
import Pagination from '../components/Pagination';

type Translation = {
  prompt_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
  updated_at?: string;
};

const LIMIT_KEY = 'favorite_limit';

const Home = () => {
  // localStorageから初期値を取得（なければ20）
  const [limit, setLimit] = useState(() => {
    const saved = localStorage.getItem(LIMIT_KEY);
    return saved ? Number(saved) : 20;
  });
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Translation[]>([]);
  const [total, setTotal] = useState(0);
  const [currentItem, setCurrentItem] = useState<Translation | null>(null);

  useEffect(() => {
    window.backend.getFavoriteList(limit, page).then((res) => {
      if ('items' in res && 'total' in res) {
        setFavorites(res.items);
        setTotal(res.total);
      } else {
        setFavorites([]);
        setTotal(0);
      }
    });
  }, [limit, page]);

  // 件数変更時に1ページ目に戻し、localStorageにも保存
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
    localStorage.setItem(LIMIT_KEY, String(newLimit));
  };
  const handleClick = (item?: Translation) => () => {
    if (item) setCurrentItem(item);
  };
  const handleEdit = (item?: Translation) => () => {
    if (item) window.location.hash = `/edit/${item.prompt_name}`;
  };
  const maxPage = Math.max(1, Math.ceil(total / limit));

  return (
    <div className='App relative'>
      <h2 className="text-xl font-bold mb-4">お気に入り一覧</h2>
      {favorites.length === 0 ? (
        <div>お気に入りはありません。</div>
      ) : (
        <div className='flex flex-col w-full max-w-full'>
          <div className='flex justify-between'>
            <div>
              <div className='flex items-center gap-8'>
                <Pagination
                  page={page}
                  maxPage={maxPage}
                  onPageChange={setPage}
                />
                <select
                  id="limit-select"
                  value={limit}
                  onChange={handleLimitChange}
                  className="border rounded px-2 py-1"
                >
                  {[5,10,20,50,100].map(value => (
                    <option key={value} value={value}>
                      {value}件
                    </option>
                  ))}
                </select>

              </div>
              <ul className='mt-4'>
                {favorites.map(item => (
                  <li key={item.prompt_name} className="mb-2">
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
              {currentItem && (
                <div className='sticky top-0 border-[1px] rounded border-gray p-4 bg-white'>
                  <DetailPanel item={currentItem} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;