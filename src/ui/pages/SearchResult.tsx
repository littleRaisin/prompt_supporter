import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Translation = {
  danbooru_name: string;
  view_name?: string;
  translation_text?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
};

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
      <h2>検索結果ページ</h2>
      <p>danbooruName: {danbooruName}</p>
      {loading && <div>Loading...</div>}
      {result && (
        <div>
          <div>表示名: {result.view_name}</div>
          <div>翻訳: {result.translation_text}</div>
          <div>メモ: {result.note}</div>
          <div>お気に入り: {result.favorite ? "★" : "☆"}</div>
          <div>著作権: {result.copyrights}</div>
        </div>
      )}
      {!loading && !result && <div>該当データがありません</div>}
    </div>
  );
};

export default SearchResult;