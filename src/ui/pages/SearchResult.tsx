import { useParams } from 'react-router-dom';

const SearchResult = () => {
  // ルートパラメータからdanbooruNameを取得
  const { danbooruName } = useParams<{ danbooruName: string }>();

  return (
    <div>
      <h2>検索結果ページ</h2>
      <p>danbooruName: {danbooruName}</p>
      {/* ここに検索結果の表示や編集ボタンなどを追加 */}
    </div>
  );
};

export default SearchResult;