type Translation = {
  danbooru_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
  updated_at?: string;
};

const DetailPanel = ({ item }: { item: Translation | null }) => {
  if (!item) return null;
  return (
    <div className='min-w-60 absolute top-0 right-0 border-[1px] rounded border-gray p-4'>
      <div>
        {item.translation_text}
        <span className='inline-block ml-2'>{item.favorite ? "★" : "☆"}</span>
      </div>
      <div className='mt-3'>
        <p>Danbooruタグ名</p>
        <p>{item.danbooru_name}</p>
      </div>
      <div className='mt-3'>
        <p>帰属</p>
        <p>{item.copyrights}</p>
      </div>
      <div className='whitespace-pre-wrap mt-3'>メモ:
        <div className='border-[1px] rounded border-gray p-2'>
          {item.note}
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
