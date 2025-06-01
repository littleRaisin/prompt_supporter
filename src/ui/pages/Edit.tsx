import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

type FormData = {
  danbooruName: string;
  translationText?: string;
  searchWord?: string;
  note?: string;
  favorite?: boolean;
  copyrights?: string;
};

  const Edit = () => {
  const { danbooruName } = useParams<{ danbooruName?: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, reset } = useForm<FormData>();

  // 編集時は既存データを取得してフォームにセット
  useEffect(() => {
    if (danbooruName) {
      window.backend.getTranslation(danbooruName).then((data) => {
        if (
          data && typeof data === 'object' &&
          'danbooru_name' in data
        ) {
          reset({
            danbooruName: (data as any).danbooru_name,
            translationText: (data as any).translation_text,
            searchWord: (data as any).search_word,
            note: (data as any).note,
            favorite: !!(data as any).favorite,
            copyrights: (data as any).copyrights,
          });
        }
      });
    }
  }, [danbooruName, reset]);

  const onSubmit = async (data: FormData) => {
    await window.backend.upsertTranslation({
      danbooruName: data.danbooruName,
      translationText: data.translationText,
      searchWord: data.searchWord,
      note: data.note,
      ...(typeof data.favorite !== "undefined" && { favorite: data.favorite ? 1 : 0 }),
      ...(typeof data.copyrights !== "undefined" && { copyrights: data.copyrights }),
    });
    navigate('/search/' + data.danbooruName);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{danbooruName ? '編集' : '新規登録'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-semibold">danbooruName</label>
          <input
            {...register('danbooruName', { required: true })}
            className="border px-2 py-1 w-full"
            disabled={!!danbooruName}
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