import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import type { Translation } from '../../types/Translation';

const Result = ({
  item,
  handleClick,
  handleEdit,  
}: {
  item: Translation,
  handleClick?: (item?: Translation) => () => void,
  handleEdit: (item?: Translation) => () => void,
}
) => {
  const { t } = useTranslation();
  const displayContent = () => {
    return (
      <>
        {item.translation_text}
        <span className='inline-block ml-2'>
          ({item.category === 'tag' || item.category === 'copyright' ? item.prompt_name : item.copyrights})
        </span>
      </>
    );
  };

  return (
    <div className='flex justify-between items-center p-1 border-b border-gray-200 gap-1 '>
      <div
        className='flex-1 cursor-pointer hover:text-blue-500 transition-colors'
        {...(handleClick ? { onClick: handleClick(item) } : {})}
      >
        {displayContent()}
      </div>
      <Button text={t('Edit')} onClick={handleEdit(item)} />
    </div>
  );
}
export default Result;
