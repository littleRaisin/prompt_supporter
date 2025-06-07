import { Toaster, toast } from 'react-hot-toast';

type Translation = {
  prompt_name: string;
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

const DetailPanel = ({ item }: { item: Translation | null }) => {
  if (!item) return null;

  // Window.navigatorを利用してクリップボードにコピーする
  const handleCopy = (target :string | undefined) => {
    if (target) {
      navigator.clipboard.writeText(target).then(() => {
        toast.success("コピーしました!");
      })
    }
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
      <div>
        {item.translation_text}
        <span className='inline-block ml-2'>{item.favorite ? "★" : "☆"}</span>
      </div>
      <div className='mt-3'>
        <TitleWithCopy label="Promptタグ名" value={item.prompt_name} onCopy={handleCopy} />
        <p className='m-1'>{item.prompt_name}</p>
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
