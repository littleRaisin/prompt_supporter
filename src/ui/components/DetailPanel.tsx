import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import type { Translation } from '../../types/Translation';
import FavoriteIcon from './FavoriteIcon';
import Button from './Button';
import { useState } from 'react';

type DetailPanelProps = {
  item: Translation | null;
  onDataChange: () => void;
};

type TitleWithCopyProps = {
  label: string;
  value?: string;
  onCopy: (value?: string) => void;
};

const TitleWithCopy = ({ label, value, onCopy }: TitleWithCopyProps) => (
  <div className='flex gap-2 items-center mb-1'>
    <p className='font-bold'>{label}</p>
    <button
      type="button"
      className="inline-flex items-center justify-center w-6 h-6 p-0 bg-transparent border-none"
      title="コピー"
      aria-label="コピー"
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

const DetailPanel = ({ item, onDataChange }: DetailPanelProps) => {
  if (!item) return null;
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(!!item.favorite);

  // Window.navigatorを利用してクリップボードにコピーする
  const handleCopy = (target :string | undefined) => {
    if (target) {
      navigator.clipboard.writeText(target).then(() => {
        toast.success("コピーしました!");
      })
    }
  };

  // お気に入り切り替え
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
    toast.success(newFavorite ? "お気に入りに追加しました" : "お気に入りを解除しました");
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
            text="編集" 
            onClick={() => {
              navigate(`/edit/${item.prompt_name}`);
            }} />
        </div>
      </div>
      
      <div className='mt-3'>
        <TitleWithCopy label="Promptタグ名" value={item.prompt_name} onCopy={handleCopy} />
        <p className='m-1'>{item.prompt_name}</p>
      </div>
      <div className='mt-3'>
        <TitleWithCopy label="コピーライト" value={item.copyrights} onCopy={handleCopy} />
        <p className='m-1'>
          <Link to={`/search/${item.copyrights}`} className='underline'>
            {item.copyrights}
          </Link>
        </p>
      </div>
      <div className='whitespace-pre-wrap mt-3'>
        <TitleWithCopy label="メモ" value={item.note} onCopy={handleCopy} />
        <div className='border-[1px] rounded border-gray p-2 m-1'>
          {item.note}
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
