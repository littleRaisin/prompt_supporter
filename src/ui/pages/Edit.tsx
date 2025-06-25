import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      <h2 className="text-xl font-bold mb-4">
        {promptName ? (isCopyMode ? t('copyAndNewRegistration') : t('Edit')) : t('New Registration')}
      </h2>
      {promptName && !isCopyMode && (
        <Button
          type="button"
          text={t('copyAndNewRegistration')}
          variant="secondary"
          onClick={handleCopy}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <div>
          <label className="block font-semibold">{t('promptName')}</label>
          <input
            {...register('promptName', { required: true })}
            className="border px-2 py-1 w-full"
            disabled={!!promptName && !isCopyMode}
            placeholder={t('enterNewPromptName')}
          />
        </div>
        <div>
          <label className="block font-semibold">{t('TranslationText')} ({t("Optional")})</label>
          <input {...register('translationText')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">{t('SearchWord')} ({t("Optional")})</label>
          <input {...register('searchWord')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">{t('Note')} ({t("Optional")})</label>
          <textarea rows={5} {...register('note')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">{t('Favorite')}</label>
          <input type="checkbox" {...register('favorite')} />
        </div>
        <div>
          <label className="block font-semibold">{t('Copyrights')}</label>
          <input {...register('copyrights')} className="border px-2 py-1 w-full" />
        </div>

        <div>
          <label className="block font-semibold">{t('Category')}</label>
          <select {...register('category')} className="border px-2 py-1 w-full">
            <option value="character">{t('Character')}</option>
            <option value="copyright">{t('Copyrights')}</option>
            <option value="tag">{t('Tag')}</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" text={t('saveButton')} variant="primary" />
          <Button type="button" text={t('cancelButton')} variant="secondary" onClick={() => navigate(-1)} />
        </div>
      </form>
    </div>
  );
};

export default Edit;
