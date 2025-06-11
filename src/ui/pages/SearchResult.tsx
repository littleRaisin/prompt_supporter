import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Result from '../components/Result';
import SidePanel from '../components/SidePanel';
import DetailPanel from '../components/DetailPanel';

type Translation = {
  prompt_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
};

const SearchResult = () => {
  const { promptName } = useParams<{ promptName: string }>();
  const [result, setResult] = useState<Translation[] | null>(null);
  const [currentItem, setCurrentItem] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!promptName) return;
    setLoading(true);
    window.backend.getTranslationList(promptName)
      .then((res) => {
        if (
          typeof res === "string" ||
          (res && "error" in res) ||
          (Array.isArray(res) && typeof res[0] === "string")
        ) {
          setResult(null);
        } else if (Array.isArray(res) && res.every(item => typeof item === "object" && item !== null && "prompt_name" in item)) {
          setResult(res as Translation[]);
        } else {
          setResult(null);
        }
      })
      .finally(() => setLoading(false));
  }, [promptName]);

  const handleClick = (item?: Translation) => () => {
    if (item) {
      setCurrentItem(item);
      setSideOpen(true);
    }
  };
  const handleEdit = (item?: Translation) => () => {
    if (item) navigate(`/edit/${item.prompt_name}`);
  };

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
          {currentItem && (
            <SidePanel open={sideOpen} onClose={() => setSideOpen(false)}>
              {currentItem && <DetailPanel item={currentItem} />}
            </SidePanel>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResult;