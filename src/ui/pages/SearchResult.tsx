import { useParams, useLocation } from 'react-router-dom'; // useLocationをインポート
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Result from '../components/Result';
import SidePanel from '../components/SidePanel';
import DetailPanel from '../components/DetailPanel';
import { useItemActions } from '../hooks/useItemActions';

import type { Translation } from '../../types/Translation';

const SearchResult = () => {
  const { t } = useTranslation();
  const { promptName } = useParams<{ promptName: string }>();
  const location = useLocation(); // useLocationフックを使用
  const [result, setResult] = useState<Translation[] | null>(null);
  const [loading, setLoading] = useState(false);

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

    // URLのクエリパラメータからカテゴリ情報を取得
    const params = new URLSearchParams(location.search);
    const categories = {
      character: params.get('character') === 'true',
      tag: params.get('tag') === 'true',
      copyright: params.get('copyright') === 'true',
    };

    window.backend.getTranslationList({ keyword: promptName, categories }) // カテゴリ情報を渡す
      .then((res) => {
        if ('error' in res) {
          setResult(null);
          toast.error(res.error);
        } else {
          setResult(res);
        }
      })
      .finally(() => setLoading(false));
  }, [promptName, location.search]); // location.searchを依存配列に追加

  useEffect(() => {
    refreshSearchResults();
  }, [refreshSearchResults]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {t('SearchWord')}:
        <span className='inline-block ml-2'>
          {promptName}
        </span>
      </h2>
      {!loading && (!result || result.length === 0) ? (
        <div>{t('No data registered')}</div>
      ) : (
        <div className='w-full max-w-full'>
          <div className='max-w-[500px]'>
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
