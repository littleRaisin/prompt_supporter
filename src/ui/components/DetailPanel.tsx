import { Toaster, toast } from 'react-hot-toast';

type Translation = {
  danbooru_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
  updated_at?: string;
};

type Props = {
  label: string;
  value?: string;
  onCopy: (value?: string) => void;
};

const TitleWithCopy = ({ label, value, onCopy }: Props) => (
  <div className='flex gap-2 items-center mb-1'>
    <p className='font-bold'>{label}</p>
    <img
      src="/ico_copy.svg"
      alt="copy"
      className='inline-block w-4 h-4 cursor-pointer'
      title="コピー"
      onClick={() => onCopy(value)}
    />
  </div>
);

const DetailPanel = ({ item }: { item: Translation | null }) => {
  if (!item) return null;

  const handleCopy = (target :string | undefined) => {
    if (target) {
      navigator.clipboard.writeText(target).then(() => {
        toast.success("コピーしました!");
      })
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div>
        {item.translation_text}
        <span className='inline-block ml-2'>{item.favorite ? "★" : "☆"}</span>
      </div>
      <div className='mt-3'>
        <TitleWithCopy label="Danbooruタグ名" value={item.danbooru_name} onCopy={handleCopy} />
        <p className='m-1'>{item.danbooru_name}</p>
      </div>
      <div className='mt-3'>
        <TitleWithCopy label="帰属" value={item.copyrights} onCopy={handleCopy} />
        <p className='m-1'>{item.copyrights}</p>
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
