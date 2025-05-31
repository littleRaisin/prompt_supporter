import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Translation = {
  danbooru_name: string;
  view_name?: string;
  translation_text?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
}[];

const SearchResult = () => {
  // ルートパラメータからdanbooruNameを取得
  const { danbooruName } = useParams<{ danbooruName: string }>();
  const [result, setResult] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!danbooruName) return;
    setLoading(true);
    window.backend.getTranslation(danbooruName)
      .then((res) => {
        if (typeof res === "string" || (res && "error" in res)) {
          setResult(null);
        } else {
          setResult(res);
        }
      })
      .finally(() => setLoading(false));
  }, [danbooruName]);

  return (
    <div>
      <h2>検索結果</h2>
      <p>danbooruName: 
        <span className='inline-block ml-2'>
          {(!result || result.length === 0) && danbooruName}
          {(result && result.length > 0) && (
            <a 
              href={`https://danbooru.donmai.us/wiki_pages/${danbooruName}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >{danbooruName}</a>
          )}
        </span>
      </p>
      {loading && <div>Loading...</div>}
      {result && result.map(item => (
        <div key={item.danbooru_name} className='mt-2'>
          <div>表示名: {item.view_name}</div>
          <div>翻訳: {item.translation_text}</div>
          <div>メモ: {item.note}</div>
          <div>お気に入り: {item.favorite ? "★" : "☆"}</div>
          <div>著作権: {item.copyrights}</div>
        </div>
      ))}
      {!loading && (!result || result.length === 0) && <div>登録されたデータがありません</div>}
    </div>
  );
};

export default SearchResult;