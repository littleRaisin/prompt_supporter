import { useParams, useNavigate } from 'react-router-dom';
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
};

const SearchResult = () => {
  const { danbooruName } = useParams<{ danbooruName: string }>();
  const [result, setResult] = useState<Translation[] | null>(null);
  const [currentItem, setCurrentItem] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!danbooruName) return;
    setLoading(true);
    window.backend.getTranslationList(danbooruName)
      .then((res) => {
        if (
          typeof res === "string" ||
          (res && "error" in res) ||
          (Array.isArray(res) && typeof res[0] === "string")
        ) {
          setResult(null);
        } else if (Array.isArray(res) && res.every(item => typeof item === "object" && item !== null && "danbooru_name" in item)) {
          setResult(res as Translation[]);
        } else {
          setResult(null);
        }
      })
      .finally(() => setLoading(false));
  }, [danbooruName]);

  const handleClick = (item?: Translation) => () => {
    if (item) setCurrentItem(item);
  };
  const handleEdit = (item?: Translation) => () => {
    if (item) navigate(`/edit/${item.danbooru_name}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        検索ワード: 
        <span className='inline-block ml-2'>
          {danbooruName}
        </span>
      </h2>
      {!loading && (!result || result.length === 0) ? (
        <div>登録されたデータがありません</div>
      ) : (
        <div className='flex justify-between w-full max-w-full'>
          <div>
            <ul>
              {result && result.map(item => (
                <li key={item.danbooru_name} className='mb-2'>
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
};

export default SearchResult;