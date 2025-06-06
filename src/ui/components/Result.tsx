import Button from '../components/Button';

const Result = ({
  item,
  handleClick,
  handleEdit,  
}: {
  item: Translation
  handleClick?: (item?: Translation) => () => void
  handleEdit: (item?: Translation) => () => void
}
) => {
  return (
    <div className='flex justify-between items-center p-1 border-b border-gray-200 gap-1 '>
      <div
        className='flex-1 cursor-pointer hover:text-blue-500 transition-colors'
        {...(handleClick ? { onClick: handleClick(item) } : {})}
      >
        {item.translation_text} <span className='inline-block ml-2'>({item.copyrights})</span>
      </div>
      <Button text="編集" onClick={handleEdit(item)} />
    </div>
  );
}
export default Result;