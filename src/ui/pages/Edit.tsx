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
  category?: string;
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
            category: data.category || 'character',
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
        promptName: '',
        translationText: data.translation_text,
        searchWord: data.search_word,
        note: data.note,
        favorite: !!data.favorite,
        copyrights: data.copyrights,
        category: data.category || 'character',
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
      category: data.category,
    });
    navigate('/search/' + trimmedPromptName);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        {promptName ? (isCopyMode ? t('common.copyAndNewRegistration') : t('common.Edit')) : t('common.New Registration')}
      </h2>
      {promptName && !isCopyMode && (
        <Button
          type="button"
          text={t('common.copyAndNewRegistration')}
          variant="secondary"
          onClick={handleCopy}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <div>
          <label className="block font-semibold">{t('common.promptName')}</label>
          <input
            {...register('promptName', { required: true })}
            className="border px-2 py-1 w-full"
            disabled={!!promptName && !isCopyMode}
            placeholder={t('common.enterNewPromptName')}
          />
        </div>
        <div>
          <label className="block font-semibold">{t('common.TranslationText')} ({t("common.Optional")})</label>
          <input {...register('translationText')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">{t('common.SearchWord')} ({t("common.Optional")})</label>
          <input {...register('searchWord')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">{t('common.Note')} ({t("common.Optional")})</label>
          <textarea rows={5} {...register('note')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">{t('common.Favorite')}</label>
          <input type="checkbox" {...register('favorite')} />
        </div>
        <div>
          <label className="block font-semibold">{t('common.Copyrights')}</label>
          <input {...register('copyrights')} className="border px-2 py-1 w-full" />
        </div>

        <div>
          <label className="block font-semibold">{t('common.Category')}</label>
          <select {...register('category')} className="border px-2 py-1 w-full">
            <option value="character">{t('common.Character')}</option>
            <option value="copyright">{t('common.Copyrights')}</option>
            <option value="tag">{t('common.Tag')}</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" text={t('common.saveButton')} variant="primary" />
          <Button type="button" text={t('common.cancelButton')} variant="secondary" onClick={() => navigate(-1)} />
        </div>
      </form>
    </div>
  );
};

export default Edit;
