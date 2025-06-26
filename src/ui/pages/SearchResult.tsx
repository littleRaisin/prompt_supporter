import { useParams, useLocation } from 'react-router-dom'; // useLocationをインポート
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Result from '../components/Result';
import SidePanel from '../components/SidePanel';
import DetailPanel from '../components/DetailPanel';
import Pagination from '../components/Pagination'; // Paginationをインポート
import { useItemActions } from '../hooks/useItemActions';

import type { Translation } from '../../types/Translation';

const LIMIT_KEY = 'search_result_limit'; // 新しいLIMIT_KEYを定義

const SearchResult = () => {
  const { t } = useTranslation();
  const { promptName } = useParams<{ promptName: string }>();
  const location = useLocation();
  const [result, setResult] = useState<Translation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(() => { // limitの状態を追加
    const saved = localStorage.getItem(LIMIT_KEY);
    return saved ? Number(saved) : 20;
  });
  const [page, setPage] = useState(1); // pageの状態を追加
  const [total, setTotal] = useState(0); // totalの状態を追加

  // useItemActionsフックを利用
  const {
    currentItem,
    sideOpen,
    handleClick,
    handleEdit,
    closeSidePanel,
  } = useItemActions();

  const refreshSearchResults = useCallback(() => {
    if (!promptName) return;
    setLoading(true);

    const params = new URLSearchParams(location.search);
    const categories = {
      character: params.get('character') === 'true',
      tag: params.get('tag') === 'true',
      copyright: params.get('copyright') === 'true',
    };

    window.backend.getTranslationList({ keyword: promptName, categories, limit, page }) // limitとpageを渡す
      .then((res) => {
        if ('error' in res) {
          setResult(null);
          setTotal(0);
          toast.error(res.error);
        } else {
          setResult(res.items); // itemsプロパティから結果を取得
          setTotal(res.total); // totalプロパティから総件数を取得
        }
      })
      .finally(() => setLoading(false));
  }, [promptName, location.search, limit, page]); // limitとpageを依存配列に追加

  useEffect(() => {
    refreshSearchResults();
  }, [refreshSearchResults]);

  // 件数変更時に1ページ目に戻し、localStorageにも保存
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1); // limit変更時は1ページ目に戻す
    localStorage.setItem(LIMIT_KEY, String(newLimit));
  };

  const maxPage = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {t('common.SearchWord')}:
        <span className='inline-block ml-2'>
          {promptName}
        </span>
      </h2>
      {!loading && (!result || result.length === 0) ? (
        <div>{t('common.No data registered')}</div>
      ) : (
        <div className='w-full max-w-full'>
          <div className='max-w-[500px]'>
            <div className='flex items-center gap-8 mb-4'> {/* ページネーションと件数選択を追加 */}
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
                    {t('common.itemsPerPage', { count: value })}
                  </option>
                ))}
              </select>
            </div>
            <ul>
              {result && result.map(item => (
                <li key={item.prompt_name} className='mb-2'>
                  <Result
                    item={item}
                    handleClick={handleClick}
                    handleEdit={handleEdit}
                  />
                </li>
              ))}
            </ul>
          </div>
          <SidePanel open={sideOpen} onClose={closeSidePanel}>
            {currentItem && <DetailPanel item={currentItem} onDataChange={refreshSearchResults} />}
          </SidePanel>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
