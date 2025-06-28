import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import FavoriteIcon from './FavoriteIcon';
import Button from './Button';
import { useState } from 'react';
import type { Translation } from '../../types/Translation';

type DetailPanelProps = {
  item: Translation | null;
  onDataChange: () => void;
};

type TitleWithCopyProps = {
  label: string;
  value?: string;
  onCopy: (value?: string) => void;
};

const TitleWithCopy = ({ label, value, onCopy }: TitleWithCopyProps) => {
  const { t } = useTranslation();
  return (
    <div className='flex gap-2 items-center mb-1'>
      <p className='font-bold'>{label}</p>
      <button
        type="button"
        className="inline-flex items-center justify-center w-6 h-6 p-0 bg-transparent border-none"
        title={t('common.copyButton')}
        aria-label={t('common.copyButton')}
        onClick={() => onCopy(value)}
      >
        <img
          src="./ico_copy.svg"
          alt=""
          className="w-4 h-4"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

const DetailPanel = ({ item, onDataChange }: DetailPanelProps) => {
  if (!item) return null;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [favorite, setFavorite] = useState(!!item.favorite);

  // Copy using navigator.clipboard
  const handleCopy = (target: string | undefined) => {
    if (target) {
      navigator.clipboard.writeText(target).then(() => {
        toast.success(t('common.copiedMessage'));
      })
    }
  };

  // Toggle favorite
  const handleFavoriteToggle = async () => {
    if (!item) return;
    const newFavorite = favorite ? 0 : 1;
    await window.backend.upsertTranslation({
      promptName: item.prompt_name,
      translationText: item.translation_text,
      searchWord: item.search_word,
      note: item.note,
      favorite: newFavorite,
      copyrights: item.copyrights,
      category: item.category,
    });
    setFavorite(!!newFavorite);
    toast.success(newFavorite ? t('common.addedToFavoritesMessage') : t('common.removedFromFavoritesMessage'));
    onDataChange();
  };

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />

      <div className='flex items-center gap-2'>
        {item.translation_text}
        <FavoriteIcon
          isFavorite={favorite}
          onClick={handleFavoriteToggle}
        />
        <div className='ml-4'>
          <Button
            text={t('common.Edit')}
            onClick={() => {
              navigate(`/edit/${item.prompt_name}`);
            }}
          />
        </div>
      </div>

      <div className='mt-3'>
        <TitleWithCopy label={t('common.prompt')} value={item.prompt_name} onCopy={handleCopy} />
        <p className='m-1'>{item.prompt_name}</p>
      </div>
      <div className='mt-3'>
        <TitleWithCopy label={t('common.Copyrights')} value={item.copyrights} onCopy={handleCopy} />
        <p className='m-1'>
          <Link to={`/search/${item.copyrights}`} className='underline'>
            {item.copyrights}
          </Link>
        </p>
      </div>
      <div className='whitespace-pre-wrap mt-3'>
        <TitleWithCopy label={t('common.Note')} value={item.note} onCopy={handleCopy} />
        <div className='border-[1px] rounded border-gray p-2 m-1'>
          {item.note}
        </div>
      </div>
    </div >
  );
};

export default DetailPanel;
