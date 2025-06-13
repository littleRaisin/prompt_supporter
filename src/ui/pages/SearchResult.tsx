import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Result from '../components/Result';
import SidePanel from '../components/SidePanel';
import DetailPanel from '../components/DetailPanel';
import { useItemActions } from '../hooks/useItemActions';

import type { Translation } from '../../types/Translation';

const SearchResult = () => {
  const { promptName } = useParams<{ promptName: string }>();
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
    window.backend.getTranslationList(promptName)
      .then((res) => {
        if ('error' in res) {
          setResult(null);
          toast.error(res.error);
        } else {
          setResult(res);
        }
      })
      .finally(() => setLoading(false));
  }, [promptName]);

  useEffect(() => {
    refreshSearchResults();
  }, [refreshSearchResults]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        検索ワード: 
        <span className='inline-block ml-2'>
          {promptName}
        </span>
      </h2>
      {!loading && (!result || result.length === 0) ? (
        <div>登録されたデータがありません</div>
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
