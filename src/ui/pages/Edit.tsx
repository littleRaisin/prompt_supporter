import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

type FormData = {
  promptName: string;
  translationText?: string;
  searchWord?: string;
  note?: string;
  favorite?: boolean;
  copyrights?: string;
};

const Edit = () => {
  const { promptName } = useParams<{ promptName?: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormData>();

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
          });
        }
      });
    }
  }, [promptName, reset]);

  const onSubmit = async (data: FormData) => {
    const trimmedPromptName = data.promptName.trim();
    await window.backend.upsertTranslation({
      promptName: trimmedPromptName,
      translationText: data.translationText,
      searchWord: data.searchWord,
      note: data.note,
      favorite: typeof data.favorite === "undefined" ? 0 : (data.favorite ? 1 : 0),
      copyrights: data.copyrights,
    });
    navigate('/search/' + trimmedPromptName);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{promptName ? '編集' : '新規登録'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-semibold">promptName</label>
          <input
            {...register('promptName', { required: true })}
            className="border px-2 py-1 w-full"
            disabled={!!promptName}
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
          <label className="block font-semibold">帰属</label>
          <input {...register('copyrights')} className="border px-2 py-1 w-full" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          保存
        </button>
      </form>
    </div>
  );
};

export default Edit;