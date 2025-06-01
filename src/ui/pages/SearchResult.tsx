import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/Button';

type Translation = {
  danbooru_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
};

const SearchResult = () => {
  // ルートパラメータからdanbooruNameを取得
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

  return (
    <div>
      <h2>検索結果</h2>
      <p>検索ワード: 
        <span className='inline-block ml-2'>
          {(!result || result.length === 0) && danbooruName}
          {(result && result.length > 0) && (
            <span>{danbooruName}</span>
          )}
        </span>
      </p>
      <div className='relative'>
        {loading && <div>Loading...</div>}
        {result && result.map(item => (
          <div key={item.danbooru_name} className='mt-2'>
            <div>
              {item.translation_text} <span className='inline-block ml-2'>({item.copyrights})</span>
            </div>
            <div className='flex gap-4'>
              <Button text="詳細" onClick={() => setCurrentItem(item)} />
              <Button text="編集" onClick={() => navigate(`/edit/${item.danbooru_name}`)} />
            </div>
          </div>
        ))}
        {!loading && (!result || result.length === 0) && <div>登録されたデータがありません</div>}
        <div className='absolute top-0 right-4'>
          {currentItem && (
            <div className='border-[1px] rounded border-gray p-4'>
              <div>{currentItem.translation_text}<span className='inline-block ml-2'>{currentItem.favorite ? "★" : "☆"}</span> </div>
              <div className='mt-3'>
                <p>Danbooruタグ名</p> 
                <p>{currentItem.danbooru_name}</p>
              </div>
              <div className='mt-3'>
                <p>帰属</p> 
                <p>{currentItem.copyrights}</p>
              </div>
              <div className='whitespace-pre-wrap mt-3'>メモ: 
                <div className='border-[1px] rounded border-gray p-2'>
                  {currentItem.note}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;