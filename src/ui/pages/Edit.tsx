import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

type FormData = {
  promptName: string;
  translationText?: string;
  searchWord?: string;
  note?: string;
  favorite?: boolean;
  copyrights?: string;
  category?: string; // categoryを追加
};

const Edit = () => {
  const { promptName } = useParams<{ promptName?: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const [isCopyMode, setIsCopyMode] = useState(false);

  // 編集時は既存データを取得してフォームにセット
  useEffect(() => {
    if (promptName) {
      const trimmedPromptName = promptName.trim();
      window.backend.getTranslation(trimmedPromptName).then((data) => {
        if (data && typeof data === 'object' && 'prompt_name' in data) {
          reset({
            promptName: trimmedPromptName,
            translationText: data.translation_text,
            searchWord: data.search_word,
            note: data.note,
            favorite: !!data.favorite,
            copyrights: data.copyrights,
            category: data.category || 'character', // categoryを追加し、デフォルト値を設定
          });
        }
      });
    } else {
      // 新規登録時はデフォルトで'character'を選択
      setValue('category', 'character');
    }
  }, [promptName, reset, setValue]);

  // コピー機能
  const handleCopy = async () => {
    if (!promptName) return;
    const trimmedPromptName = promptName.trim();
    const data = await window.backend.getTranslation(trimmedPromptName);
    if (data && typeof data === 'object' && 'prompt_name' in data) {
      reset({
        promptName: '', // 新規登録用に空欄
        translationText: data.translation_text,
        searchWord: data.search_word,
        note: data.note,
        favorite: !!data.favorite,
        copyrights: data.copyrights,
        category: data.category || 'character', // categoryを追加し、デフォルト値を設定
      });
      setIsCopyMode(true);
    }
  };

  const onSubmit = async (data: FormData) => {
    const trimmedPromptName = data.promptName.trim();
    await window.backend.upsertTranslation({
      promptName: trimmedPromptName,
      translationText: data.translationText,
      searchWord: data.searchWord,
      note: data.note,
      favorite: typeof data.favorite === "undefined" ? 0 : (data.favorite ? 1 : 0),
      copyrights: data.copyrights,
      category: data.category, // categoryを追加
    });
    navigate('/search/' + trimmedPromptName);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{promptName ? (isCopyMode ? 'コピーして新規登録' : '編集') : '新規登録'}</h2>
      {promptName && !isCopyMode && (
        <Button
          type="button"
          text="この内容をコピーして新規登録"
          variant="secondary"
          onClick={handleCopy}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <div>
          <label className="block font-semibold">promptName</label>
          <input
            {...register('promptName', { required: true })}
            className="border px-2 py-1 w-full"
            disabled={!!promptName && !isCopyMode}
            placeholder="新しいpromptNameを入力"
          />
        </div>
        <div>
          <label className="block font-semibold">翻訳テキスト（任意）</label>
          <input {...register('translationText')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">検索ワード（任意）</label>
          <input {...register('searchWord')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">メモ（任意）</label>
          <textarea rows={5} {...register('note')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">お気に入り</label>
          <input type="checkbox" {...register('favorite')} />
        </div>
        <div>
          <label className="block font-semibold">コピーライト</label>
          <input {...register('copyrights')} className="border px-2 py-1 w-full" />
        </div>

        <div>
          <label className="block font-semibold">カテゴリー</label>
          <select {...register('category')} className="border px-2 py-1 w-full">
            <option value="character">キャラクター</option>
            <option value="copyright">コピーライト</option>
            <option value="tag">タグ</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" text="保存" variant="primary" />
          <Button type="button" text="キャンセル" variant="secondary" onClick={() => navigate(-1)} />
        </div>
      </form>
    </div>
  );
};

export default Edit;
