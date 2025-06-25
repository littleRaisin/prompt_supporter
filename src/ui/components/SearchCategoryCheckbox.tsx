import { useTranslation } from 'react-i18next';

type SearchCategoryCheckboxProps = {
  label: string;
  categoryKey: 'character' | 'tag' | 'copyright'; // 'character', 'tag', 'copyright'
  checked: boolean;
  onChange: (category: 'character' | 'tag' | 'copyright') => void;
};

const SearchCategoryCheckbox = ({ label, categoryKey, checked, onChange }: SearchCategoryCheckboxProps) => {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(categoryKey)}
        className="mr-1"
      />
      {label}
    </label>
  );
};

export default SearchCategoryCheckbox;
